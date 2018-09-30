import React, { Component } from 'react';

class ToggleAll extends Component {
  render() {
    return (
      <React.Fragment>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={this.props.changeCompletedStateFromAllTodos}
        />
        <label htmlFor="toggle-all" />
      </React.Fragment>
    );
  }
}

export default ToggleAll;
