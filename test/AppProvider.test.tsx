import * as Enzyme from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppProvider, use, IContext } from '../src';

import { contextWithDependency } from './contexts/ContextWithDependency';
import { context, ITodoList } from './contexts/SomeContext';
import { a, b } from './contexts/ContextsWithCyclicDependencies';
import { aContext, bContext, cContext } from './contexts/ComplexDependenciesContexts';

describe('<AppProvider>', () => {
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
});
