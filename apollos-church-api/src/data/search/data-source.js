/* eslint-disable no-await-in-loop */
import { dataSource as coreSearch } from '@apollosproject/data-connector-algolia-search';
import { graphql } from 'graphql';
import {
  parseCursor,
  createCursor,
  createGlobalId,
} from '@apollosproject/server-core';

class Search extends coreSearch {
  async mapItemToAlgolia(item) {
    const { ContentItem } = this.context.dataSources;
    const type = await ContentItem.resolveType(item);
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
      tags: [String]
      author: Person
      __typename
      coverImage { sources { uri } }
    }
    ... on DevotionalContentItem{
       id
      title
      summary
      author{firstName lastName}
      objectID: id
      tags: [String]
      author: Person
      __typename
      coverImage { sources { uri } }
    }
    ... on WeekendContentItem{
       id
      title
      summary
      htmlContent
      author{firstName lastName}
      objectID: id
      tags: [String]
      author: Person
      __typename
      coverImage { sources { uri } }
    }
    ... on UniversalContentItem{
       id
      title
      summary
      htmlContent
      author{firstName lastName}
      objectID: id
      tags: [String]
      author: Person
      __typename
      coverImage { sources { uri } }
    }
    ... on MediaContentItem{
       id
      title
      summary
      htmlContent
      author{firstName lastName}
      objectID: id
      tags: [String]
      author: Person
      __typename
      coverImage { sources { uri } }
    }
  }
}`,
      {},
      this.context
    );
    return data.node;
  }

  // Add functionality here that will add in the events to be searched.
  async deltaIndex() {
    const { ContentItem } = this.context.dataSources;
    let itemsLeft = true;
    const args = { after: null, first: 100 };
    while (itemsLeft) {
      const { edges } = await ContentItem.paginate({
        cursor: await ContentItem.forSearchDateAndActive(),
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
    const { ContentItem } = this.context.dataSources;
    let itemsLeft = true;
    const args = { after: null, first: 100 };
    while (itemsLeft) {
      const { edges } = await ContentItem.paginate({
        cursor: ContentItem.forSearch(),
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
