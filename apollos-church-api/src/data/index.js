import { gql } from 'apollo-server';

import {
  createApolloServerConfig,
  Interfaces,
} from '@apollosproject/server-core';

import * as Analytics from '@apollosproject/data-connector-analytics';
import * as Scripture from '@apollosproject/data-connector-bible';
import * as LiveStream from '@apollosproject/data-connector-church-online';
import * as Cloudinary from '@apollosproject/data-connector-cloudinary';
import * as OneSignal from '@apollosproject/data-connector-onesignal';
import * as Search from '@apollosproject/data-connector-algolia-search';
import * as Pass from '@apollosproject/data-connector-passes';
import * as Cache from '@apollosproject/data-connector-redis-cache';
// import * as Sms from '@apollosproject/data-connector-twilio';
import {
  Followings,
  Interactions,
  RockConstants,
  // Person,
  // ContentItem,
  ContentChannel,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
  AuthSms,
  Campus,
  Group,
  BinaryFiles,
  Feature,
  FeatureFeed,
  // Event,
  PrayerRequest,
  // ActionAlgorithm,
} from '@apollosproject/data-connector-rock';

import { Comment, UserFlag } from '@apollosproject/data-connector-postgres';

import * as Theme from './theme';

// This module is used to attach Rock User updating to the OneSignal module.
// This module includes a Resolver that overides a resolver defined in `OneSignal`
import * as OneSignalWithRock from './oneSignalWithRock';

import * as ContentItem from './content-items';
import * as Event from './event';
// import * as Feature from './features/data-source';
import * as Person from './person';
import * as Sms from './clearstream';
import * as ActionAlgorithm from './action-algorithms';
// import * as Search from './search';

const data = {
  Interfaces,
  Followings,
  ContentChannel,
  ContentItem,
  Person,
  Cloudinary,
  Auth,
  AuthSms,
  Sms,
  LiveStream,
  Theme,
  Scripture,
  Interactions,
  RockConstants,
  Sharable,
  Analytics,
  OneSignal,
  PersonalDevice,
  OneSignalWithRock,
  Pass,
  Search,
  Template,
  Campus,
  Group,
  BinaryFiles,
  Feature,
  FeatureFeed,
  ActionAlgorithm,
  Event,
  Cache,
  PrayerRequest,
  Comment,
  UserFlag,
};

const {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
} = createApolloServerConfig(data);

export {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
};

// the upload Scalar is added
export const testSchema = [
  gql`
    scalar Upload
  `,
  ...schema,
];
