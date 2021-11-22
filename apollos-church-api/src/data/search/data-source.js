/* eslint-disable no-await-in-loop */
import { dataSource as coreSearch } from '@apollosproject/data-connector-algolia-search';
import { graphql } from 'graphql';
import {
  parseCursor,
  createCursor,
  createGlobalId,
} from '@apollosproject/server-core';
import moment from 'moment-timezone';

import ApollosConfig from '@apollosproject/config';

const { CONTENT } = ApollosConfig;
class Search extends coreSearch {
  calIds = CONTENT.ALL_CALIDS;

  contentIds = CONTENT.ALL_CONTENT_CHANNELS;

  async mapItemToAlgolia(item, passedType) {
    let type = null;
    if (passedType === 'Content_Items') {
      const { ContentItem } = this.context.dataSources;
      type = await ContentItem.resolveType(item);
    }
    if (passedType === 'Event') {
      type = 'Event';
    }
    const { data } = await graphql(
      this.context.schema,
      `
query getItem {
  node(id: "${createGlobalId(item.id, type)}") {
    ... on ContentItem {
      id
      title
      summary
      htmlContent
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
    ... on DevotionalContentItem{
       id
      title
      summary
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
    ... on WeekendContentItem{
       id
      title
      summary
      htmlContent
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
    ... on UniversalContentItem{
       id
      title
      summary
      htmlContent
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
    ... on MediaContentItem{
       id
      title
      summary
      htmlContent
      objectID: id
      __typename
      coverImage { sources { uri } }
    }
    ... on Event{
      id
      title
      htmlContent
      location
      start
      end
      objecID: id
      coverImage{ sources {uri}}
      __typename
    }
  }
}`,
      {},
      this.context
    );
    return data.node;
  }

  // Add functionality here that will add in the events to be searched.
  async deltaIndex({ datetime }) {
    const { ContentItem, Event } = this.context.dataSources;
    await Promise.all(
      this.contentIds.map(async (channelId) => {
        let itemsLeft = true;
        const args = { after: null, first: 100 };

        while (itemsLeft) {
          const { edges } = await ContentItem.paginate({
            cursor: await ContentItem.getFromCategoryIds([channelId]).andFilter(
              `(CreatedDateTime gt datetime'${datetime}') or (ModifiedDateTime gt datetime'${datetime}')`
            ),
            args,
          });

          const result = await edges;
          const items = result.map(({ node }) => node);
          itemsLeft = items.length === 100;

          if (itemsLeft) args.after = result[result.length - 1].cursor;
          const indexableItems = await Promise.all(
            items.map((item) => this.mapItemToAlgolia(item))
          );

          await this.addObjects(indexableItems);
        }
      })
    );
    await Promise.all(
      this.calIds.map(async (id) => {
        const events = await Event.findRecent(id)
          .andFilter(
            `(Schedule/EffectiveEndDate ge datetime'${moment()
              // we need to subtract a day. The EffectiveEndDate is often the morning of the current day.
              // It's okay to get already occured events, because we filter them out later on.
              .subtract(1, 'day')
              .toISOString()}' or Schedule/EffectiveEndDate eq null)`
          )
          .get();
        const indexableItems = await Promise.all(
          events.map((item) => this.mapItemToAlgolia(item, 'Event'))
        );
        await this.addObjects(indexableItems);
      })
    );
  }

  // Add functionality here to allow events to eb indexed. Possibly add for groupas.
  async indexAll() {
    await new Promise((resolve, reject) =>
      this.index.clearIndex((err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    );
    const { ContentItem, Event } = this.context.dataSources;
    await Promise.all(
      this.contentIds.map(async (channelId) => {
        let itemsLeft = true;
        const args = { after: null, first: 100 };

        while (itemsLeft) {
          const { edges } = await ContentItem.paginate({
            cursor: await ContentItem.getFromCategoryIds([channelId]),
            args,
          });

          const result = await edges;
          const items = result.map(({ node }) => node);
          itemsLeft = items.length === 100;

          if (itemsLeft) args.after = result[result.length - 1].cursor;

          const indexableItems = await Promise.all(
            items.map((item) => this.mapItemToAlgolia(item))
          );

          await this.addObjects(indexableItems);
        }
      })
    );
    await Promise.all(
      this.calIds.map(async (id) => {
        const events = await Event.findRecent(id)
          .andFilter(
            `(Schedule/EffectiveEndDate ge datetime'${moment()
              // we need to subtract a day. The EffectiveEndDate is often the morning of the current day.
              // It's okay to get already occured events, because we filter them out later on.
              .subtract(1, 'day')
              .toISOString()}' or Schedule/EffectiveEndDate eq null)`
          )
          .get();
        const indexableItems = await Promise.all(
          events.map((item) => this.mapItemToAlgolia(item, 'Event'))
        );
        await this.addObjects(indexableItems);
      })
    );
  }

  async byPaginatedQuery({ query, after, first = 20 }) {
    const length = first;
    let offset = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        offset = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const { hits } = await this.index.search({ query, length, offset });
    return hits.map((node, i) => ({
      ...node,
      cursor: createCursor({ position: i + offset }),
    }));
  }
}
export default Search;
