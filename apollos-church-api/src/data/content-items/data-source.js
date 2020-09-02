import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS, ROCK_CONSTANTS } = ApollosConfig;
const imageURL = 'images.crossings.church'

class dataSource extends ContentItem.dataSource {
    expanded = true;

    attributeIsImage = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.IMAGE || 
    (key.toLowerCase().includes('image') &&
      typeof attributeValues[key].value === 'string' &&(attributeValues[key].value.startsWith('http') ||
      attributeValues[key].valueFormatted.startsWith('http'))); // looks like an image url
    
    
    getImages = ({ attributeValues, attributes }) => {
        const imageKeys = Object.keys(attributes).filter((key) =>
          this.attributeIsImage({
            key,
            attributeValues,
            attributes,
          })
        );
        var obj =``
        return imageKeys.map((key) => ({
          __typename: 'ImageMedia',
          key,
          name: attributes[key].name,
          sources: attributeValues[key].value
            ? [{ uri: attributeValues[key].valueFormatted.replace("cccrockweb.s3.amazonaws.com", imageURL)}]
            : [],
        }));
      };
}

const {resolver, schema} = ContentItem;

export {dataSource, resolver, schema};