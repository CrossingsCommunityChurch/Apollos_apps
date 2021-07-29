import ApollosConfig from '@apollosproject/config';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import Redis from 'ioredis';

const { ROCK } = ApollosConfig;

const { REDIS_URL } = process.env;

let client;
let subscriber;
let queueOpts;

if (REDIS_URL) {
  client = new Redis(REDIS_URL);
  subscriber = new Redis(REDIS_URL);

  // Used to ensure that N+3 redis connections are not created per queue.
  // https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#reusing-redis-connections
  queueOpts = {
    createClient(type, redisOpts) {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        case 'bclient':
          return new Redis(REDIS_URL, redisOpts);
        default:
          throw new Error('Unexpected connection type: ', type);
      }
    },
  };
}

const createJobs = ({ getContext, queues, trigger = () => null }) => {
  console.log('CREATING JOBS!!!!!!!!!!!!!!!!!!!!!!!!');
  const FullIndexQueue = queues.add('algolia-full-index-queue', queueOpts);
  const DeltaIndexQueue = queues.add('algolia-delta-index-queue', queueOpts);

  FullIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  DeltaIndexQueue.process(async () => {
    const context = getContext();
    const jobs = await DeltaIndexQueue.getCompleted();
    const timestamp = isEmpty(jobs)
      ? moment()
          .subtract(1, 'day')
          .toDate()
      : jobs.map((j) => j.opts.timestamp).sort((a, b) => {
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          }
          return 0;
        })[0];
    const datetime = moment(timestamp)
      .tz(ROCK.TIMEZONE)
      .format()
      .split(/[-+]\d+:\d+/)[0];
    return context.dataSources.Search.deltaIndex({ datetime });
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * 1' } });
  DeltaIndexQueue.add(null, { repeat: { cron: '15 3 * * *' } });

  // add manual index trigger
  trigger('/manual-index', FullIndexQueue);
};

export default createJobs;
