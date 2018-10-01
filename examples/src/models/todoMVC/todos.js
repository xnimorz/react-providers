import React from 'react';

const TodosContext = React.createContext();

const LS_KEY = '[react-providers]todos';

class TodosContextProvider extends React.Component {
  constructor(props) {
    super(props);

    let lsData;
    // localStorage could be not available in private mode in safari for example
    try {
      lsData = JSON.parse(localStorage.getItem(LS_KEY));
    } catch (ignore) {}

    this.state = {
      data: { list: lsData || [] },
    };
  }

  // We can use react lifecycle methods to organise our work!
  componentDidUpdate() {
    // localStorage could be not available in private mode in safari for example
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.data.list));
    } catch (ignore) {}
  }

  // You can get access to the methods from context consumer
  // This methods like reducers in Redux changes the state of application, but using react api
  add = (todo) => {
    this.setState((state) => ({
      data: {
        list: [
          ...state.data.list,
          { id: 1 + Math.max(0, ...state.data.list.map((todo) => todo.id)), text: todo, completed: false },
        ],
      },
    }));
  };

  remove = (id) => {
    this.setState((state) => ({
      data: {
        list: state.data.list.filter((todo) => todo.id !== id),
      },
    }));
  };

  rename = (id, newText) => {
    this.setState((state) => ({
      data: {
        list: state.data.list.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)),
      },
    }));
  };

  changeCompletedState = (id) => {
    this.setState((state) => ({
      data: {
        list: state.data.list.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
      },
    }));
  };

  changeCompletedStateFromAllTodos = () => {
    this.setState((state) => {
      const shouldMarkAsCompleted = state.data.list.some((todo) => !todo.completed);
      return {
        data: {
          list: state.data.list.map((todo) => ({ ...todo, completed: shouldMarkAsCompleted })),
        },
      };
    });
  };

  render() {
    // describe data that will be Context.Provider value (we can use here memoization, or move it to state to avoid unnecessary rerenders)
    const value = {
      data: this.state.data,
      add: this.add,
      remove: this.remove,
      rename: this.rename,
      changeCompletedState: this.changeCompletedState,
      changeCompletedStateFromAllTodos: this.changeCompletedStateFromAllTodos,
    };

    // Provide value to consumer
    return <TodosContext.Provider value={value}>{this.props.children}</TodosContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export default {
  Consumer: TodosContext.Consumer,
  Provider: TodosContextProvider,
};
