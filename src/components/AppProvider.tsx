import * as React from 'react';
import { IContextMap, ContextStatuses, IContext } from '../interfaces';

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

AppProvider.displayName = 'AppProvider';

// Get contexts to calculate dependencies in use HOC
export const getCurrentContexts = () => {
  return _contexts;
};
