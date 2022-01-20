import gql from 'graphql-tag';

export default gql`
  type Group implements Node & ContentNode {
    id: ID!
    title(hyphenated: Boolean): String
    htmlContent: String
    coverImage: ImageMedia

    location: String
    start: String
    end: String
  }

  extend type Campus {
    groups: [Group]
  }
`;
