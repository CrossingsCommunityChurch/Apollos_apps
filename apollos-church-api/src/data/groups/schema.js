import gql from 'graphql-tag';

export default gql`
  type Group implements Node & ContentNode & ShareableNode {
    id: ID!
    title(hyphenated: Boolean): String
    htmlContent: String
    coverImage: ImageMedia

    location: String
    start: String
    end: String
    sharing: SharableContentItem
  }

  extend type Campus {
    groups: [Group]
  }
`;
