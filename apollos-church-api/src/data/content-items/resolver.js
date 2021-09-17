import { ContentItem as coreContentItem } from '@apollosproject/data-connector-postgres';

import { get } from 'lodash';

// const resolverExtensions = {
//   author: ({ attributeValues }) => {
//     if (get(attributeValues, 'author.value', null)) {
//       return attributeValues.author.valueFormatted;
//     }
//     if (get(attributeValues, 'speaker.value', null)) {
//       return attributeValues.speaker.valueFormatted;
//     }

//     return null;
//   },
// };

const liveResolver = {
  ...coreContentItem.resolver.ContentItem,
};

const resolver = {
  ...coreContentItem.resolver,
  LiveContentItem: {
    ...coreContentItem.resolver.MediaContentItem,
    ...liveResolver,
  },
};

export default resolver;
