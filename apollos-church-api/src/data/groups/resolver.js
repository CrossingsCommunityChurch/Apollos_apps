import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    title: (root) => root.name,
    htmlContent: (root) => root.description,
    start: async ({ id }, args, { dataSources }) => {
      const group = await dataSources.Group.getTime(id);
      return group.start;
    },
    end: async ({ id }, args, { dataSources }) => {
      const group = await dataSources.Group.getTime(id);
      return group.end;
    },
    coverImage: async ({ id }, args, { dataSources }) => {
      const image = await dataSources.Group.getImage(id);
      return image;
    },
    location: async ({ id }, args, { dataSources }) => {
      const location = await dataSources.Group.getLocation(id);
      return location;
    },
    sharing: (root, args, { dataSources }) => ({
      url: dataSources.Group.getShareUrl(root),
      title: 'Share via ...',
      message: `${root.name} - `,
    }),
  },
  Campus: {
    groups: ({ id }, args, { dataSources }) =>
      dataSources.Groups.getByCampus(id),
  },
};

export default resolver;
