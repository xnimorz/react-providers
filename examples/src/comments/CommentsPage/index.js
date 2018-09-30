import React, { Component } from 'react';

import { use } from 'react-providers';

import CommentsList from '../CommentsList';
import Button from '../../common/Button';

import './styles.css';

class CommentsPage extends Component {
  render() {
    return (
      <div className="commentsPage">
        <Button onClick={this.props.comments.fetchCommentsPage}>Load comments and users</Button>
        <CommentsList />
      </div>
    );
  }
}

export default use('comments')(CommentsPage);
