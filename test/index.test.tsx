import * as Enzyme from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppProvider, use, IContext } from '../src';

import { contextWithDependency } from './contexts/ContextWithDependency';
import { context, ITodoList } from './contexts/SomeContext';
import { a, b } from './contexts/ContextsWithCyclicDependencies';
import { aContext, bContext, cContext } from './contexts/ComplexDependenciesContexts';

describe('<AppProvider>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AppProvider contexts={{}} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders correctly', () => {
    const tree = Enzyme.shallow(<AppProvider contexts={{}} />);
    expect(tree).toMatchSnapshot();
  });

  it('adds Context.Provider when rendering', () => {
    const tree = Enzyme.mount(
      <AppProvider contexts={{ some: context }}>
        <div />
      </AppProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('resolves dependencies in contexts', () => {
    const tree = Enzyme.mount(
      <AppProvider contexts={{ some: context, contextWithDependency }}>
        <div />
      </AppProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('thows an error when dependencies are cyclic', () => {
    const spy = jest.fn();
    class ErrorBoundary extends React.Component {
      state = { error: false };
      componentDidCatch() {
        spy();
      }

      render() {
        return this.props.children;
      }
    }

    const tree = Enzyme.mount(
      <ErrorBoundary>
        <AppProvider contexts={{ a, b }}>
          <div />
        </AppProvider>
      </ErrorBoundary>
    );

    expect(spy.mock.calls.length).toBe(1);
  });

  it('works with complex dependencies e.g. A depends on C, B depends both on A and on C', () => {
    const tree = Enzyme.mount(
      <AppProvider contexts={{ a: aContext, b: bContext, c: cContext }}>
        <div />
      </AppProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('<Use>', () => {
  class WrappedComponent extends React.Component {
    render() {
      return <div />;
    }
  }
  it('renders without crashing', () => {
    const UseSome = use('some')(WrappedComponent);
    const div = document.createElement('div');
    ReactDOM.render(
      <AppProvider contexts={{ some: context }}>
        <UseSome />
      </AppProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('renders correctly', () => {
    const UseSome = use('some')(WrappedComponent);
    const tree = Enzyme.mount(
      <AppProvider contexts={{ some: context }}>
        <UseSome />
      </AppProvider>
    );

    expect(tree).toMatchSnapshot();
  });

  it('adds access to context data to wrapped component', () => {
    class WrappedComponent extends React.Component<{ some: { data: ITodoList; add: Function } }, {}> {
      componentDidMount() {
        expect(this.props.some.data.list).toEqual([]);
      }
      render() {
        return <div />;
      }
    }
    const UseSome = use('some')(WrappedComponent);
    const tree = Enzyme.mount(
      <AppProvider contexts={{ some: context }}>
        <UseSome />
      </AppProvider>
    );
  });

  it('adds access to context data and methods to wrapped component', () => {
    class WrappedComponent extends React.Component<{ some: { data: ITodoList; add: Function } }, {}> {
      componentDidMount() {
        this.props.some.add('Some todo');
      }
      componentDidUpdate() {
        expect(this.props.some.data.list[0].text).toBe('Some todo');
      }
      render() {
        return <div />;
      }
    }
    const UseSome = use('some')(WrappedComponent);
    const tree = Enzyme.mount(
      <AppProvider contexts={{ some: context }}>
        <UseSome />
      </AppProvider>
    );

    tree.update();
  });
});
