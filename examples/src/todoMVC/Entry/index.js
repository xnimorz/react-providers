import React, { Component } from 'react';
import './styles.css';

import { AppProvider } from 'react-providers';
import todos from '../models/todos';
import TodoInput from '../TodoInput';
import TodoList from '../TodoList';
import Footer from '../Footer';

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

// Here we can use memoization, but it'd be too much for our example
const FILTERS_METHODS = {
  [FILTERS.all]: (todos) => todos,
  [FILTERS.active]: (todos) => todos.filter((todo) => !todo.completed),
  [FILTERS.completed]: (todos) => todos.filter((todo) => todo.completed),
};

class TodoMVCApp extends Component {
  state = { filter: FILTERS.all };

  render() {
    return (
      <AppProvider contexts={{ todos }}>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <TodoInput />
          </header>
          <section className="main">
            <TodoList filter={FILTERS_METHODS[this.state.filter]} />
          </section>
          <Footer filter={this.state.filter} filters={FILTERS} setFilter={(filter) => this.setState({ filter })} />
        </section>
        <p>
          View this example on github:{' '}
          <a target="_blank" href="https://github.com/xnimorz/react-providers/tree/master/examples/src/todoMVC">
            https://github.com/xnimorz/react-providers/tree/master/examples/src/todoMVC
          </a>
        </p>
      </AppProvider>
    );
  }
}

export default TodoMVCApp;
