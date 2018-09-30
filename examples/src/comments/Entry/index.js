import React, { Component } from 'react';

import { AppProvider } from 'react-providers';
import users from '../../models/comments/users';
import comments from '../../models/comments/comments';

import Description from '../Description';
import CommentsPage from '../CommentsPage';

class Entry extends Component {
  render() {
    return (
      <AppProvider contexts={{ comments, users }}>
        <Description />
        <CommentsPage />
      </AppProvider>
    );
  }
}

export default Entry;
