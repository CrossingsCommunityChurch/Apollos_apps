// import { resolver as baseLive } from '@apollosproject/data-connector-church-online';
import { createGlobalId } from '@apollosproject/server-core/lib/node';

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
      console.log('ROOT is ', root);
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
      if (nextInstance) {
        const { end } = nextInstance;
        return end;
      }

      return null;
    },
  },
};

export default resolver;
