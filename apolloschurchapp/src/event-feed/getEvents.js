import gql from 'graphql-tag';

export default gql`
  query allEvents {
    allEvents {
      id
      htmlContent
      title
      start
      end
      location
      coverImage {
        sources {
          uri
        }
      }
    }
  }
`;
