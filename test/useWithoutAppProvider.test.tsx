import * as Enzyme from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppProvider, use, IContext } from '../src';

import { context, ITodoList } from './contexts/SomeContext';
import { cContext } from './contexts/ComplexDependenciesContexts';

describe('<Use>', () => {
  class WrappedComponent extends React.Component {
    render() {
      return <div />;
    }
  }

  it('works without AppProvider and receive an object with context besides strings ', () => {
    class WrappedComponent extends React.Component<{ todos: { data: ITodoList; add: Function } }, {}> {
      componentDidMount() {
        expect(this.props.todos.data.list).toEqual([]);
      }
      render() {
        return <div />;
      }
    }
    const UseTodoContext = use({ todos: context })(WrappedComponent);
    const { Provider } = context;
    Enzyme.mount(
      <Provider>
        <UseTodoContext />
      </Provider>
    );
  });

  it('adds access to context data and methods to wrapped component', () => {
    class WrappedComponent extends React.Component<{ todos: { data: ITodoList; add: Function } }, {}> {
      componentDidMount() {
        this.props.todos.add('Some todo');
      }
      componentDidUpdate() {
        expect(this.props.todos.data.list[0].text).toBe('Some todo');
      }
      render() {
        return <div />;
      }
    }
    const UseTodoContext = use({ todos: context })(WrappedComponent);
    const { Provider } = context;
    const tree = Enzyme.mount(
      <Provider>
        <UseTodoContext />
      </Provider>
    );

    tree.update();
  });

  it('works with multiple contexts described as an object in the HOC', () => {
    class WrappedComponent extends React.Component<
      { todos: { data: ITodoList; add: Function }; additionalContext: { data: string } },
      {}
    > {
      componentDidMount() {
        expect(this.props.todos.data.list).toEqual([]);
        expect(this.props.additionalContext.data).toEqual('Hello world');
      }
      render() {
        return <div />;
      }
    }
    const UseMultipleContexts = use({ todos: context, additionalContext: cContext })(WrappedComponent);
    const TodosProvider = context.Provider;
    const CContextProvider = cContext.Provider;
    Enzyme.mount(
      <TodosProvider>
        <CContextProvider>
          <UseMultipleContexts />
        </CContextProvider>
      </TodosProvider>
    );
  });
});
