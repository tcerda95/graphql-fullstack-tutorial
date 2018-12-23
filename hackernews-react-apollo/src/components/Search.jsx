import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import LinkList from './LinkList';

class Search extends Component {
  state = {
    links: [],
    filter: ''
  }

  render() {
    const { links, filter } = this.state;

    return (
      <div>
        <div>
          Search
          <input type='text' value={filter} onChange={e => this.setState({ filter: e.target.value })} />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        <LinkList links={links} />
      </div>
    )
  }

  // Imperative approach
  // A declarative approach would be using Query component with refetch props
  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export default withApollo(Search);
