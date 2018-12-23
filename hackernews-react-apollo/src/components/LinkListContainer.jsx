import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import LinkList from './LinkList';
import { LINKS_PER_PAGE } from '../constants';

class LinksContainer extends Component {

  getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new');
    const page = parseInt(this.props.match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;

    return { first, skip, orderBy };
  }

  updateStoreOnVote = (cache, { data: { vote } }) => {
    const linkId = vote.link.id;
    const variables = this.getQueryVariables();
    const data = cache.readQuery({ query: FEED_QUERY, variables });

    const votedLink = data.feed.links.find(l => l.id === linkId);

    votedLink.votes = vote.link.votes;

    cache.writeQuery({ query: FEED_QUERY, data, variables });
  }

  subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) 
          return prev;

        const { newLink } = subscriptionData.data;
        const newState = { ...prev };

        newState.feed.links = [newLink, ...prev.feed.links];
        newState.feed.count += 1;

        return newState;
      }
    });
  }

  nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10);

    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  }

  previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10);

    if (page > 1) {
      const previousPage = page - 1;
      this.props.history.push(`/new/${previousPage}`);
    }
  }

  getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new');

    if (isNewPage)
      return data.feed.links;

    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    
    return rankedLinks;
  }

  queryRender = ({ loading, error, data, subscribeToMore }) => {
    if (loading)
      return <div>Fetching</div>;

    if (error)
      return <div>Error</div>;

    this.subscribeToNewLinks(subscribeToMore);

    const links = this.getLinksToRender(data);

    const isNewPage = this.props.location.pathname.includes('new');
    const pageIndex = this.props.match.params.page
      ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
      : 0;

    return (
      <Fragment>
        <Mutation mutation={VOTE_MUTATION} update={this.updateStoreOnVote}>
          {vote => <LinkList links={links} indexOffset={pageIndex} onVote={linkId => vote({ variables: { linkId } })} />}
        </Mutation>
        {isNewPage && (
          <div className="flex ml4 mv3 gray">
            <div className="pointer mr2" onClick={this.previousPage}>
              Previous
            </div>
            <div className="pointer" onClick={() => this.nextPage(data)}>
              Next
            </div>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this.getQueryVariables()} fetchPolicy="cache-first">
        {this.queryRender}
      </Query>
    );    
  }
}

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
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

export const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
        }
      }
      user {
        id
      }
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`;

export default LinksContainer;
