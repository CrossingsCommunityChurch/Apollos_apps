import { Event } from '@apollosproject/data-connector-rock';

export default {
  ...Event.resolver,
  Event: {
    ...Event.resolver.Event,
    start: async ({ schedule }, args, { dataSources }) => {
      const event = await dataSources.Event.getDateTime(schedule);
      return event.start;
    },
    end: async ({ schedule }, args, { dataSources }) => {
      const event = await dataSources.Event.getDateTime(schedule);
      return event.end;
    },
  },
  Query: {
    allEvents: (root, args, { dataSources }) =>
      dataSources.Event.getAllEvents(),
  },
};
