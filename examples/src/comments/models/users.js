import React from 'react';

const UsersContext = React.createContext();

class UsersContextProvider extends React.Component {
  state = {
    dict: {},
  };

  receiveUsers = (users) => {
    this.setState({ dict: users });
  };

  render() {
    const value = {
      data: this.state.dict,
      receiveUsers: this.receiveUsers,
    };

    return <UsersContext.Provider value={value}>{this.props.children}</UsersContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export default {
  Consumer: UsersContext.Consumer,
  Provider: UsersContextProvider,
};
