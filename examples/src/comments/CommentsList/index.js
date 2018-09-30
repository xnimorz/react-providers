import React, { Component } from 'react';

import { use } from 'react-providers';
import Loader from '../../common/Loader';
import statuses from '../../models/comments/statuses';
import Comment from '../Comment';

import './styles.css';

class CommentsList extends Component {
  renderList() {
    if (this.props.comments.data.status === statuses.fetching) {
      return <Loader />;
    }

    return this.props.comments.data.list.map((comment) => (
      <Comment id={comment.id} comment={comment} user={this.props.users.data[comment.user]} />
    ));
  }
  render() {
    return <div className="commentsList">{this.renderList()}</div>;
  }
}

// you can use several dependencies through several use calls
export default use('comments')(use('users')(CommentsList));
