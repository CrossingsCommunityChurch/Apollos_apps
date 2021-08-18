import { Feature as coreFeatures } from '@apollosproject/data-connector-postgres';
import { createGlobalId } from '@apollosproject/server-core';

const id = (type) => ({ apollosId, id: rootId }) =>
  apollosId || createGlobalId(rootId, type);

const resolver = {
  ...coreFeatures.resolver,
  LiveStreamListFeature: {
    id: id('LiveStreamListFeature'),
  },
};

export default resolver;
