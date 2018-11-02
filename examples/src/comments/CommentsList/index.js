import React, { Component } from 'react';

import { use } from 'react-providers';
import Loader from '../../common/Loader';
import Comment from '../Comment';

import statuses from '../models/statuses';
import comments from '../models/comments';
import users from '../models/users';

import './styles.css';

class CommentsList extends Component {
  renderList() {
    if (this.props.comments.data.status === statuses.fetching) {
      return <Loader />;
    }

    return this.props.comments.data.list.map((comment) => (
      <Comment key={comment.id} id={comment.id} comment={comment} user={this.props.users.data[comment.user]} />
    ));
  }
  render() {
    return <div className="commentsList">{this.renderList()}</div>;
  }
}

export default use({ comments, users })(CommentsList);
