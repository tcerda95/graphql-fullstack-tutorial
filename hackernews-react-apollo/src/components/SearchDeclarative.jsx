import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { VOTE_MUTATION } from './LinkListContainer';
import gql from 'graphql-tag';
import LinkList from './LinkList';

class Search extends Component {
  state = {
    filter: ''
  }

  updateStoreOnVote = (cache, { data: { vote } }) => {
    const { filter } = this.state;
    const linkId = vote.link.id;
    const data = cache.readQuery({ query: FEED_SEARCH_QUERY, variables: { filter } });

    const votedLink = data.feed.links.find(l => l.id === linkId);

    votedLink.votes = vote.link.votes;

    cache.writeQuery({ query: FEED_SEARCH_QUERY, variables: { filter }, data });
  };

  searchRender = vote => ({ error, loading, data, refetch }) => {
    const { filter } = this.state;
    const showList = data && data.feed;

    return (
      <div>
        <div>
          Search
          <input type='text' value={filter} onChange={e => this.setState({ filter: e.target.value })} />
          <button onClick={() => refetch({ filter })}>OK</button>
        </div>
        {showList && <LinkList links={data.feed.links} onVote={linkId => vote({ variables: { linkId } })} />}
      </div>
    );
  }

  render() {
    const { filter } = this.state;

    // Set filter on variables prop to refetch query on each setState
    return (
      <Mutation mutation={VOTE_MUTATION} update={this.updateStoreOnVote}>
      {vote => (
        <Query query={FEED_SEARCH_QUERY} skip={!filter}>
          {this.searchRender(vote)}
        </Query>
      )}
      </Mutation>
    )
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
        }
      }
    }
  }
`;

export default Search;
