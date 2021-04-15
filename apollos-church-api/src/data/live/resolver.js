import { resolver as baseLive } from '@apollosproject/data-connector-church-online';
import { resolverMerge } from '@apollosproject/server-core';
import { createGlobalId } from '@apollosproject/server-core/lib/node';
import { get, isEmpty } from 'lodash';

const resolver = {
  Query: {
    liveStreams: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStreams(),
  },
  LiveNode: {
    __resolveType: ({ __typename, __type }, args, resolveInfo) =>
      __typename || resolveInfo.schema.getType(__type),
  },
  LiveStream: {
    id: (root, args, context, { parentType }) =>
      createGlobalId(root?.contentItem?.guid, parentType.name),
    eventStartTime: async (root, _, { dataSources }) => {
      const { LiveStream } = dataSources;
      const nextInstance = await LiveStream.getNextInstance(root.contentItem);
      if (nextInstance) {
        const { start } = nextInstance;
        return start;
      }

      return null;
    },
    eventEndTime: async (root, _, { dataSources }) => {
      const { LiveStream } = dataSources;
      const nextInstance = await LiveStream.getNextInstance(root.contentItem);
      console.log(`Next start time is ${JSON.stringify(nextInstance)}`);
      if (nextInstance) {
        const { end } = nextInstance;
        return end;
      }

      return null;
    },
  },
};

export default resolverMerge(resolver, baseLive);
