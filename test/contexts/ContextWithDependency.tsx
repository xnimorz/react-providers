import * as React from 'react';
import { IContext, use } from '../../src';

const ContextWithDependency = React.createContext({});

class ContextWithDependencyProvider extends React.Component<{}, { data: string }> {
  state: Readonly<{ data: string }> = {
    data: 'Hello world',
  };

  render() {
    const value = {
      data: this.state.data,
    };

    // Provide value to consumer
    return <ContextWithDependency.Provider value={value}>{this.props.children}</ContextWithDependency.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export const contextWithDependency: IContext = {
  Consumer: ContextWithDependency.Consumer,
  Provider: use('some')(ContextWithDependencyProvider),
};
