import { Feature } from '@apollosproject/data-connector-postgres';
import { default as schema } from './schema';
import { default as dataSource } from './data-source';
import { default as resolver } from './resolver';

const { models, migrations } = Feature;

export { models, schema, dataSource, resolver, migrations };
