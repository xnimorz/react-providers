import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './styles.css';

import Button from './common/Button';
import MainInfo from './info/MainInfo';
import TodoMVC from './todoMVC/TodoMVC';
import CommentsEntry from './comments/Entry';

const VIEWS = {
  INFO: 'info',
  TODO: 'todoExample',
  COMMENTS: 'commentsExample',
};
class App extends PureComponent {
  state = { view: VIEWS.INFO };

  renderInfo() {
    if (this.state.view === VIEWS.INFO) {
      return <MainInfo />;
    }
    return null;
  }

  renderTodoMVC() {
    if (this.state.view === VIEWS.TODO) {
      return <TodoMVC />;
    }
    return null;
  }

  renderCommentsExample() {
    if (this.state.view === VIEWS.COMMENTS) {
      return <CommentsEntry />;
    }
    return null;
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">Welcome to react-providers</h1>
          <div className="app__viewsSwitcher">
            <Button
              clicked={this.state.view === VIEWS.INFO}
              onClick={() => {
                this.setState({ view: VIEWS.INFO });
              }}
            >
              Library docs
            </Button>
            <Button
              clicked={this.state.view === VIEWS.TODO}
              onClick={() => {
                this.setState({ view: VIEWS.TODO });
              }}
            >
              TodoMVC example
            </Button>
            <Button
              clicked={this.state.view === VIEWS.COMMENTS}
              onClick={() => {
                this.setState({ view: VIEWS.COMMENTS });
              }}
            >
              Comments example
            </Button>
          </div>
        </header>
        <div className="app__content">
          {this.renderInfo()}
          {this.renderTodoMVC()}
          {this.renderCommentsExample()}
        </div>
      </div>
    );
  }
}

export default App;
