import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './styles.css';

import MenuButton from './common/MenuButton';
import MainInfo from './info/MainInfo';
import TodoMVC from './todoMVC/Entry';
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
          <div className="app__headerContent">
            <div className="app__project">
              <h1 className="app__title">React-providers</h1>
              <a
                href="https://github.com/xnimorz/react-providers/blob/master/CHANGELOG.md"
                target="_blank"
                className="app__version"
              >
                2.0
              </a>
            </div>
            <div className="app__viewsSwitcher">
              <MenuButton
                clicked={this.state.view === VIEWS.INFO}
                onClick={() => {
                  this.setState({ view: VIEWS.INFO });
                }}
              >
                About
              </MenuButton>
              <MenuButton
                clicked={this.state.view === VIEWS.TODO}
                onClick={() => {
                  this.setState({ view: VIEWS.TODO });
                }}
              >
                TodoMVC example
              </MenuButton>
              <MenuButton
                clicked={this.state.view === VIEWS.COMMENTS}
                onClick={() => {
                  this.setState({ view: VIEWS.COMMENTS });
                }}
              >
                Comments example
              </MenuButton>
              <MenuButton href="https://github.com/xnimorz/react-providers" target="_blank">
                GitHub
              </MenuButton>
            </div>
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
