import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    title: (root) => root.name,
    htmlContent: (root) => root.description,
    start: async ({ schedule }, args, { dataSources }) => {
      const group = await dataSources.Group.getDateTime(schedule);
      return group.start;
    },
    end: async ({ schedule }, args, { dataSources }) => {
      const group = await dataSources.Group.getDateTime(schedule);
      return group.end;
    },
    coverImage: async ({ id }, args, { dataSources }) => {
      const image = await dataSources.Group.getImage(id);
      return image;
    },
  },
  Campus: {
    groups: ({ id }, args, { dataSources }) =>
      dataSources.Groups.getByCampus(id),
  },
};

export default resolver;
