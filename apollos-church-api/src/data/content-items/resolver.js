import { ContentItem as coreContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

import { get, split } from 'lodash';

const resolverExtensions = {
  tags: (root, { dataSources: { ContentItem } }) => {
    const tagString = ContentItem.getTags(root.guid);
    console.log('tag value is: ', tagString);
  },
  author: ({ attributeValues }) => {
    if (get(attributeValues, 'author.value', null)) {
      return attributeValues.author.valueFormatted;
    }
    if (get(attributeValues, 'speaker.value', null)) {
      return attributeValues.speaker.valueFormatted;
    }

    return null;
  },
};

const liveResolver = {
  ...coreContentItem.resolver.ContentItem,
  webviewURL: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getWebviewURL(root),

  mediaURL: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getMediaURL(root),
};

const resolver = {
  DevotionalContentItem: {
    ...resolverExtensions,
  },
  UniversalContentItem: {
    ...resolverExtensions,
  },
  ContentSeriesContentItem: {
    ...resolverExtensions,
  },
  MediaContentItem: {
    ...resolverExtensions,
  },
  WeekendContentItem: {
    ...resolverExtensions,
  },
  LiveContentItem: {
    ...liveResolver,
  },
};

export default resolverMerge(resolver, coreContentItem);
