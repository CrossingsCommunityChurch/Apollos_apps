import { resolver as baseLive } from '@apollosproject/data-connector-church-online';
import { resolverMerge } from '@apollosproject/server-core';

const resolver = {
  Query: {
    liveStreams: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStreams(),
  },
  LiveNode: {
    __resolveType: ({ __typename, __type }, args, resolveInfo) =>
      __typename || resolveInfo.schema.getType(__type),
  },
};

export default resolverMerge(resolver, baseLive);
