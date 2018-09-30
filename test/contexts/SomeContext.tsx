import * as React from 'react';
import { IContext } from '../../src';

const TodosContext = React.createContext({});

interface ITodo {
  id: number;
  text: string;
  completed: boolean;
}

class TodosContextProvider extends React.Component<{}, { data: { list: ITodo[] } }> {
  state: Readonly<{ data: { list: ITodo[] } }> = {
    data: { list: [] },
  };

  // You can get access to the methods from context consumer
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

  render() {
    const value = {
      data: this.state.data,
      add: this.add,
    };

    // Provide value to consumer
    return <TodosContext.Provider value={value}>{this.props.children}</TodosContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export const context: IContext = {
  Consumer: TodosContext.Consumer,
  Provider: TodosContextProvider,
};
