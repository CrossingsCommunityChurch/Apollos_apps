import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Query: {
    groups: (root, args, { dataSources }) => dataSources.Groups.getGroups(),
  },
  Group: {
    id: (root, args, context, { parentType }) =>
      createGlobalId(root?.id, parentType.name),
  },
  Campus: {
    groups: ({ id }, args, { dataSources }) =>
      dataSources.Groups.getByCampus(id),
  },
};

export default resolver;
