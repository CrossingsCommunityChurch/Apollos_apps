import { ContentItem as coreContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

import { get, split } from 'lodash';

const resolverExtensions = {
  tags: ({ attributeValues }) =>
    split(get(attributeValues, 'tags.value', ''), ','),
  author: async ({ attributeValues }, args, { dataSources }) => {
    if (get(attributeValues, 'author.value', null)) {
      const { id } = await dataSources.Person.getFromAliasId(
        attributeValues.author.value
      );

      const person = await dataSources.Person.getFromId(id);

      return person;
    }
    if (get(attributeValues, 'speaker.value', null)) {
      const { id } = await dataSources.Person.getFromAliasId(
        attributeValues.speaker.value
      );

      const person = await dataSources.Person.getFromId(id);

      return person;
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
