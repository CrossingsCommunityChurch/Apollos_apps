import { resolver as baseLive } from '@apollosproject/data-connector-church-online';
import { resolverMerge } from '@apollosproject/server-core';

const resolver = {
  LiveStream: {
    relatedNode: async ({ attributeValues }, _, { dataSources }) => {
      const contentItemId = attributeValues?.contentItem?.value;
      if (contentItemId && !isEmpty(contentItemId)) {
        const { ContentItem } = dataSources;
        const contentItem = await ContentItem.getFromId(contentItemId);
        const __typename = ContentItem.resolveType(contentItem);

        return {
          __typename,
          ...contentItem,
        };
      }

      return null;
    },
  },
  Query: {
    liveStreams: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStreams(),
  },
};

export default resolverMerge(resolver, baseLive);
