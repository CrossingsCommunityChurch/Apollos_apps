import { Feature as coreFeatures } from '@apollosproject/data-connector-postgres';
import { createGlobalId } from '@apollosproject/server-core';

const id = (type) => ({ apollosId, id: rootId }) =>
  apollosId || createGlobalId(rootId, type);

const resolver = {
  ...coreFeatures.resolver,
  LiveStreamListFeature: {
    id: id('LiveStreamListFeature'),
  },
  WebviewFeature: {
    height: ({ args, height }) => args?.height || height || 400,
    id: id('WebviewFeature'),
    url: ({ args, url }) => args?.url || url || '',
  },
};

export default resolver;
