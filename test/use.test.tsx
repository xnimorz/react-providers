import * as Enzyme from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppProvider, use, IContext } from '../src';

import { contextWithDependency } from './contexts/ContextWithDependency';
import { context, ITodoList } from './contexts/SomeContext';
import { a, b } from './contexts/ContextsWithCyclicDependencies';
import { aContext, bContext, cContext } from './contexts/ComplexDependenciesContexts';

describe('<Use>', () => {
  class WrappedComponent extends React.Component {
    render() {
      return <div />;
    }
  }

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

  it('works with object besides string', () => {
    class WrappedComponent extends React.Component<{ some: { data: ITodoList; add: Function } }, {}> {
      componentDidMount() {
        expect(this.props.some.data.list).toEqual([]);
      }
      render() {
        return <div />;
      }
    }
    const UseSome = use({ some: context })(WrappedComponent);
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

  it('works with complex dependencies using arrays', () => {
    const ApplyContexts = use(['a', 'b', 'c'])(WrappedComponent);
    const tree = Enzyme.mount(
      <AppProvider contexts={{ a: aContext, b: bContext, c: cContext }}>
        <ApplyContexts />
      </AppProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('works with complex dependencies e.g. A depends on C, B depends both on A and on C', () => {
    const ApplyContexts = use('a')(use('b')(use('c')(WrappedComponent)));
    const tree = Enzyme.mount(
      <AppProvider contexts={{ a: aContext, b: bContext, c: cContext }}>
        <ApplyContexts />
      </AppProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it("throws an error when context isn't found", () => {
    const spy = jest.fn();
    class ErrorBoundary extends React.Component {
      componentDidCatch() {
        spy();
      }

      render() {
        return this.props.children;
      }
    }

    const ApplyContexts = use('SomeContextThatIsNotPresentedInStore')(WrappedComponent);
    const tree = Enzyme.mount(
      <AppProvider contexts={{ a: aContext }}>
        <ErrorBoundary>
          <ApplyContexts />
        </ErrorBoundary>
      </AppProvider>
    );
    expect(spy.mock.calls.length).toBe(1);
  });

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
});
