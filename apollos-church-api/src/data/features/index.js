import { Feature } from '@apollosproject/data-connector-postgres';
import { default as schema } from './schema';
import { default as dataSource } from './data-source';
import { default as resolver } from './resolver';

const { model, migrations } = Feature;

export { model, schema, dataSource, resolver, migrations };
