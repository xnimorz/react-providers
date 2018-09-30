import React from 'react';

import './styles.css';

export default function Comment({ user, comment }) {
  return (
    <div className="comment">
      <strong className="comment__autor">{user.name}</strong>
      <span className="comment__text">{comment.text}</span>
    </div>
  );
}
