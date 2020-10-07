import { ContentItem as originalContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;

const defaultResolvers = {
    sharing: (root, args, { dataSources: { ContentItem } }) => ({
      url: ContentItem.getShareUrl(root),
      title: 'Share via ...',
      message: `${root.title} - ${ContentItem.createSummary(root)}`,
    }),
  
    theme: (root, input, { dataSources }) =>
      dataSources.ContentItem.getTheme(root),
  
    childContentItemsConnection: async (root, args, { dataSources }) => {
      const cursor = await dataSources.ContentItem.getCursorByParentContentItemId(
        root.id
      );
      if (ROCK_MAPPINGS.CAMPAIGN_CHANNEL_IDS.includes(root.contentChannelId)) {
        cursor.orderBy('StartDateTime', 'desc');
      }
      return dataSources.ContentItem.paginate({
        cursor,
        args,
      });
    },
  };

const resolver = {
    DevotionalContentItem: {
        ...defaultResolvers,
        scriptures: async (
            { attributeValues: { scriptures } = {} },
            args,
            { dataSources }
          ) => dataSources.ContentItem.getContentItemScriptures(scriptures),
    }
}

export default resolverMerge(resolver, originalContentItem);