import React, { Component } from 'react';
import { use } from 'react-providers';

import ToggleAll from '../ToggleAll';
import Todo from '../Todo';
import todos from '../models/todos';

class TodoList extends Component {
  renderToggleAllControl() {
    if (this.props.todos.data.list.length === 0) {
      return null;
    }
    return <ToggleAll changeCompletedStateFromAllTodos={this.props.todos.changeCompletedStateFromAllTodos} />;
  }
  render() {
    const todos = this.props.filter(this.props.todos.data.list);
    return (
      <React.Fragment>
        {this.renderToggleAllControl()}
        <ul className="todo-list">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              rename={this.props.todos.rename}
              remove={this.props.todos.remove}
              changeCompletedState={this.props.todos.changeCompletedState}
            />
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default use({ todos })(TodoList);
