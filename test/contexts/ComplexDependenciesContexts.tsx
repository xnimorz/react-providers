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
export const aContext: IContext = {
  Consumer: A.Consumer,
  Provider: use('c')(AProvider),
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
export const bContext: IContext = {
  Consumer: B.Consumer,
  Provider: use('a')(use('c')(BProvider)),
};

const C = React.createContext({});

class CProvider extends React.Component<{}, { data: string }> {
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
export const cContext: IContext = {
  Consumer: C.Consumer,
  Provider: CProvider,
};
