import { PrayerRequest } from '@apollosproject/data-connector-rock';
import dataSource from './data-source';

const { resolver, schema } = PrayerRequest;

export { resolver, schema, dataSource };
