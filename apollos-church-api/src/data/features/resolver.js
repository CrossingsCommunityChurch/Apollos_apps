import { Feature as coreFeatures } from '@apollosproject/data-connector-rock';
import { resolverMerge, createGlobalId } from '@apollosproject/server-core';

const resolver = {
  LiveStreamListFeature: {
    id: ({ id }) => createGlobalId(id, 'LiveStreamListFeature'),
  },
};

export default resolverMerge(resolver, coreFeatures);
