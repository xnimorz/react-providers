import React, { Component } from 'react';
import Input from '../../common/Input';

import todos from '../../models/todoMVC/todos';
import { use } from 'react-providers';

class TodoInput extends Component {
  render() {
    return (
      <Input
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyDown={(e) => {
          if (e.which === 13) {
            this.props.todos.add(e.target.value);
            e.target.value = '';
          }
        }}
      />
    );
  }
}

export default use({ todos })(TodoInput);
