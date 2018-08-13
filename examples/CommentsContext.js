import React from 'react';

const CommentsContext = React.createContext();

// You async operations e.g. axios, fetch, etc.
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([1, 2, 3, 4]);
    }, 2000);
  });
};

class CommentsContextProvider extends React.Component {
  state = {
    data: [],
    status: 'initial',
  };

  fetchData = async () => {
    // methods are accessible from context consumer
    const data = await fetchData();

    this.setState({
      status: 'success',
      data,
    });
  };

  render() {
    const value = {
      data: this.state.data,
      fetchData: this.fetchData,
    };

    // Provide value to consumer
    return <CommentsContext.Provider value={value}>{this.props.children}</CommentsContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
exports = {
  Consumer: CommentsContext.Consumer,
  Provider: CommentsContextProvider,
};
