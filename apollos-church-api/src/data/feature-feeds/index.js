import { FeatureFeed } from '@apollosproject/data-connector-rock';

const { dataSource } = FeatureFeed;

export { default as resolver } from './resolver';
export { default as schema } from './schema';
export { dataSource };
