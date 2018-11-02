import React, { Component } from 'react';
import { use } from 'react-providers';

import todos from '../models/todos';
import Filters from '../Filters';

class Footer extends Component {
  render() {
    const incompleted = this.props.todos.data.list.filter((todo) => !todo.completed).length;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{incompleted}</strong>
          <span>{` item${incompleted > 1 ? 's' : ''} left`}</span>
        </span>
        <Filters filter={this.props.filter} filters={this.props.filters} setFilter={this.props.setFilter} />
      </footer>
    );
  }
}

export default use({ todos })(Footer);
