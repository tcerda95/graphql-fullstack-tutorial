import React from 'react';
import Link from './Link';

const LinkList = ({ links, onVote, indexOffset = 0 }) => (
  <div>{links.map((l, i) => <Link key={l.id} index={i + indexOffset} link={l} onVote={onVote} />)}</div>
);

export default LinkList;
