import { Person } from '@apollosproject/data-connector-postgres';
import dataSource from './data-source';

const { resolver, schema, migrations, models } = Person;

export { resolver, schema, migrations, models, dataSource };
