import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import CreateLink from './CreateLink';
import { FEED_QUERY } from './LinkListContainer';
import { LINKS_PER_PAGE } from '../constants';

class CreateLinkContainer extends Component {
  state = {
    linkValue: {
      description: '',
      url: ''
    }
  }

  handleChange = linkValue => {
    this.setState({ linkValue });
  }

  handleComplete = () => {
    this.props.history.push('/');
  }

  handleUpdate = (cache, { data: { post } }) => {
    const first = LINKS_PER_PAGE;
    const skip = 0;
    const orderBy = 'createdAt_DESC';
    const data = cache.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } });

    data.feed.links.unshift(post);
    
    cache.writeQuery({ query: FEED_QUERY, data, variables: { first, skip, orderBy } });
  }

  render() {
    const { linkValue } = this.state;

    return (
      <Mutation mutation={POST_MUTATION} variables={linkValue} onCompleted={this.handleComplete} update={this.handleUpdate}>
        {(postMutation, { loading }) => <CreateLink onSubmit={postMutation} onChange={this.handleChange} value={linkValue} submitting={loading} />}
      </Mutation>    
    );
  }
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

export default CreateLinkContainer;
