import * as React from 'react';
import { IContext, use } from '../../src';

const A = React.createContext({});

class AProvider extends React.Component<{}, { data: string }> {
  state: Readonly<{ data: string }> = {
    data: 'Hello world',
  };

  render() {
    const value = {
      data: this.state.data,
    };

    // Provide value to consumer
    return <A.Provider value={value}>{this.props.children}</A.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export const a: IContext = {
  Consumer: A.Consumer,
  Provider: use('b')(AProvider),
};

const B = React.createContext({});

class BProvider extends React.Component<{}, { data: string }> {
  state: Readonly<{ data: string }> = {
    data: 'Hello world',
  };

  render() {
    const value = {
      data: this.state.data,
    };

    // Provide value to consumer
    return <B.Provider value={value}>{this.props.children}</B.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export const b: IContext = {
  Consumer: B.Consumer,
  Provider: use('a')(BProvider),
};
