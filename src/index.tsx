import * as React from 'react';
import * as hoistStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';

export enum ContextStatuses {
  PENDING = 'pending',
  PROCESSING = 'processing',
  INCLUDED = 'included',
}

export interface IComponentAdditionals {
  contextDependency?: string[];
  displayName?: string;
  name?: string;
}

export interface IContext {
  Provider: React.ComponentType & IComponentAdditionals;
  Consumer: React.ComponentType;
  status?: ContextStatuses;
}

export interface IContextMap {
  [key: string]: IContext;
}

const _contexts: IContextMap = {};

export const AppProvider = (data: { contexts: IContextMap; children?: JSX.Element }) => {
  const providers: React.ComponentType[] = [];
  const { contexts, children } = data;
  // init context
  Object.keys(contexts).forEach((name) => {
    const { Provider, Consumer } = contexts[name];
    _contexts[name] = { Provider, Consumer, status: ContextStatuses.PENDING };
  });

  // create providers graph
  const resolveDependenciesAndAdd = (context: IContext) => {
    if (context.status === ContextStatuses.INCLUDED) {
      return;
    }
    if (context.status === ContextStatuses.PROCESSING) {
      throw new Error(`Cyclic dependency was detected.`);
    }
    context.status = ContextStatuses.PROCESSING;

    if (context.Provider.contextDependency) {
      context.Provider.contextDependency.forEach((contextName: string) => {
        resolveDependenciesAndAdd(_contexts[contextName]);
      });
    }

    providers.push(context.Provider);
    context.status = ContextStatuses.INCLUDED;
  };

  Object.keys(_contexts).forEach((contextName: string) => {
    resolveDependenciesAndAdd(_contexts[contextName]);
  });

  // check if any contexts were setted
  if (providers.length === 0) {
    return children || null;
  }

  return providers
    .reverse()
    .reduce((store: JSX.Element, Provider: React.ComponentType) => <Provider>{store}</Provider>, children);
};

export const use = (contextName: string) => (Component: (React.ComponentType) & IComponentAdditionals) => {
  class Wrap extends React.Component {
    static displayName = `use(${Component.displayName || Component.name})`;
    static contextDependency;

    render() {
      if (!_contexts.hasOwnProperty(contextName)) {
        throw new Error(`There is no such context name ${contextName}.`);
      }

      const Consumer: React.ComponentType = _contexts[contextName].Consumer;

      return (
        <Consumer>
          {(props) => {
            const data = { [contextName]: props };
            return <Component {...this.props} {...data} />;
          }}
        </Consumer>
      );
    }
  }

  if (Component.contextDependency && Array.isArray(Component.contextDependency)) {
    Wrap.contextDependency = [...Component.contextDependency, contextName];
  } else {
    Wrap.contextDependency = [contextName];
  }

  return hoistStatics(Wrap, Component);
};
