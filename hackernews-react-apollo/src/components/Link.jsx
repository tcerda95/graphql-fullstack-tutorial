import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

class Link extends Component {
  render() {
    const { onVote, link, index } = this.props;
    const { id, description, url, postedBy, createdAt, votes } = link;
    const authToken = localStorage.getItem(AUTH_TOKEN);

    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{index + 1}.</span>
          {authToken && (
            <div className="ml1 gray f11" onClick={() => onVote(id)}>
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div>
            {description} ({url})
          </div>
          <div className="f6 lh-copy gray">
            {votes.length} votes | by{' '}
            {postedBy? postedBy.name : 'Unknown'}
            {' '}
            {timeDifferenceForDate(createdAt)}
          </div>
        </div>
      </div>
    );
  }
}

export default Link;
