import React from 'react';

import { use } from 'react-providers';
import statuses from './statuses';

const CommentsContext = React.createContext();

function fetchCommentsPage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        comments: [
          { id: 1, text: 'Hello world', user: 1 },
          { id: 2, text: 'Hello from Rome', user: 2 },
          { id: 3, text: 'I just wrote a new book', user: 1 },
        ],
        users: {
          '1': {
            name: 'Mark Twen',
          },
          '2': {
            name: 'Lucius Annaeus Sĕnĕca',
          },
        },
      });
    }, 2000);
  });
}

class CommentsContextProvider extends React.Component {
  state = {
    list: [],
    status: statuses.dirty,
  };

  // you can store your asinc logic right here
  fetchCommentsPage = async () => {
    this.setState({ status: statuses.fetching });

    // emulate server request
    const { comments, users } = await fetchCommentsPage();

    // We can call methods from users context. All we need is to add dependency through `use` function
    this.props.users.receiveUsers(users);

    this.setState({
      status: statuses.clear,
      list: comments,
    });
  };

  render() {
    const value = {
      data: this.state,
      fetchCommentsPage: this.fetchCommentsPage,
    };

    return <CommentsContext.Provider value={value}>{this.props.children}</CommentsContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export default {
  Consumer: CommentsContext.Consumer,
  Provider: use('users')(CommentsContextProvider),
};
