import { createGlobalId } from '@apollosproject/server-core/lib/node';

const resolver = {
  Query: {
    liveStream: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStream(),
    liveStreams: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStreams(),
  },
  LiveNode: {
    __resolveType: ({ __typename, __type }, args, resolveInfo) =>
      __typename || resolveInfo.schema.getType(__type),
  },
  LiveStream: {
    id: (root, args, context, { parentType }) =>
      createGlobalId(root?.contentItem?.id, parentType.name),
  },
};

export default resolver;
