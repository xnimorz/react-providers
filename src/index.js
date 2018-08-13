import React from 'react';
import hoistStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';

const _contexts = {};

const PENDING = 'pending';
const PROCESSING = 'processing';
const INCLUDED = 'included';

// TODO: use statefull component instead of stateless
export const AppProvider = ({ contexts, children }) => {
  // init context
  Object.keys(contexts).forEach((name) => {
    const { provider, consumer } = contexts[name];
    _contexts[name] = { provider, consumer, status: PENDING };
  });

  const providers = [];

  // create providers graph
  const resolveDependenciesAndAdd = (context) => {
    if (context.status === INCLUDED) {
      return;
    }
    if (context.status === PROCESSING) {
      throw new Error(`Cyclic dependency was detected.`);
    }
    context.status = PROCESSING;

    if (context.provider.contextDependency) {
      context.provider.contextDependency.forEach((contextName) => {
        resolveDependenciesAndAdd(_contexts[contextName]);
      });
    }

    providers.push(context.provider);
    context.status = INCLUDED;
  };

  // Add all providers to graph
  Object.keys(_contexts).forEach((contextName) => {
    resolveDependenciesAndAdd(_contexts[contextName]);
  });

  // render
  return providers.reverse().reduce((store, Provider) => <Provider>{store}</Provider>, children);
};

export const use = (contextName) => (Component) => {
  const fullName = contextName + 'Context';
  if (!_contexts.hasOwnProperty(fullName)) {
    const contextKeys = Object.keys(contexts).toString();
    throw new Error(`There is no such context name ${fullName}.`);
  }

  const { Consumer } = contexts[fullName];

  const Wrap = (parentProps) => (
    <Consumer>
      {(value) => {
        const props = { [contextName]: value };
        return <Component {...parentProps} {...props} />;
      }}
    </Consumer>
  );

  Wrap.displayName = `use(${Component.displayName || Component.name})`;

  if (Component.contextDependency && Array.isArray(Component.contextDependency)) {
    Wrap.contextDependency = [...Component.contextDependency, fullName];
  } else {
    Wrap.contextDependency = [fullName];
  }

  return hoistStatics(Wrap, Component);
};
