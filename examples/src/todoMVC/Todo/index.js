import React, { Component } from 'react';

import Input from '../../common/Input';

const VIEWS = {
  VIEW: 'view',
  EDIT: 'edit',
};

class Todo extends Component {
  state = { view: VIEWS.VIEW };
  render() {
    return (
      <li
        className={this.state.view === VIEWS.EDIT ? 'editing' : ''}
        onDoubleClick={() => this.setState({ view: VIEWS.EDIT })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            id={this.props.todo.id}
            onChange={(e) => {
              this.props.changeCompletedState(this.props.todo.id);
            }}
          />
          <label htmlFor={this.props.todo.id}>{this.props.todo.text}</label>
          <button
            className="destroy"
            onClick={() => {
              this.props.remove(this.props.todo.id);
            }}
          />
        </div>
        <Input
          className="edit"
          defaultValue={this.props.todo.text}
          onBlur={() => {
            this.setState({ view: VIEWS.VIEW });
          }}
          onKeyDown={(e) => {
            if (e.which === 13) {
              this.props.rename(this.props.todo.id, e.target.value);
              this.setState({ view: VIEWS.VIEW });
            }
          }}
        />
      </li>
    );
  }
}

export default Todo;
