import React, { Component } from 'react';

function Filter({ active, target, setFilter, children }) {
  return (
    <li>
      <a
        href="#"
        className={active === target ? 'selected' : ''}
        onClick={(e) => {
          e.preventDefault();
          setFilter(target);
        }}
      >
        {children}
      </a>
    </li>
  );
}

class Filters extends Component {
  render() {
    return (
      <ul className="filters">
        <Filter active={this.props.filter} target={this.props.filters.all} setFilter={this.props.setFilter}>
          All
        </Filter>
        <Filter active={this.props.filter} target={this.props.filters.active} setFilter={this.props.setFilter}>
          Active
        </Filter>
        <Filter active={this.props.filter} target={this.props.filters.completed} setFilter={this.props.setFilter}>
          Completed
        </Filter>
      </ul>
    );
  }
}

export default Filters;
