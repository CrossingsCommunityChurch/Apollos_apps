import { ContentItem } from '@apollosproject/data-connector-postgres';
import { dataSource } from './data-source';
import { default as resolver } from './resolver';
import { default as schema } from './schema';

const { models } = ContentItem;
export { models, dataSource, resolver, schema };
