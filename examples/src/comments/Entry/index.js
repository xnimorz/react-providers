import React, { Component } from 'react';

import { AppProvider } from 'react-providers';
import users from '../models/users';
import comments from '../models/comments';

import Description from '../Description';
import CommentsPage from '../CommentsPage';

class Entry extends Component {
  render() {
    return (
      <AppProvider contexts={{ comments, users }}>
        <Description />
        <CommentsPage />
        <p>
          View this example on github:{' '}
          <a target="_blank" href="https://github.com/xnimorz/react-providers/tree/master/examples/src/comments">
            https://github.com/xnimorz/react-providers/tree/master/examples/src/comments
          </a>
        </p>
      </AppProvider>
    );
  }
}

export default Entry;
