import * as React from 'react';
import * as hoistStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';
import { getCurrentContexts } from './AppProvider';
import { IComponentAdditionals, IContextMap } from '../interfaces';

export const use = (context: string | Array<string> | IContextMap) => (
  Component: (React.ComponentType) & IComponentAdditionals
) => {
  let contexts: Array<string> | IContextMap = context as Array<string> | IContextMap;
  if (typeof context === 'string') {
    contexts = [context];
  }

  class Wrap extends React.Component {
    static displayName = `use(${Component.displayName || Component.name})`;
    static contextDependency;

    /**
     * Render a react subTree without intermediate components.
     * So we can get a clear subtree (with recursion):
     * ```
     *  <Consumer1>
     *    {value1 =>
     *      <Consumer2>
     *        {value2 =>
     *          <YourWrappedComponent name1={value1} name2={value2} />
     *        }
     *      </Consumer2>
     *    }
     *  </Consumer1>
     * ```
     * instead of (without recursion):
     * ```
     *  <Consumer1>
     *    {value1 =>
     *      <Wrap name1={value1}>
     *        <Consumer2>
     *          {value2 =>
     *            <YourWrappedComponent name1={value1} name2={value2} />
     *          }
     *        </Consumer2>
     *      </Wrap>
     *    }
     *  </Consumer1>
     * ```
     */
    renderPreparedMap(contextNames: Array<string>, contextMap: IContextMap) {
      const propsMap: { [key: string]: any } = {};

      const renderItem = (index: number): JSX.Element => {
        if (index === contextNames.length) {
          return <Component {...this.props} {...propsMap} />;
        }

        const contextName = contextNames[index];
        const Consumer: React.ComponentType = contextMap[contextName].Consumer;
        return (
          <Consumer>
            {(props) => {
              propsMap[contextName] = props;
              return renderItem(index + 1);
            }}
          </Consumer>
        );
      };

      return renderItem(0);
    }

    renderUsingArray(contextArray: Array<string>) {
      const nameWithoutSuchContext = contextArray.find(
        (contextName) => !getCurrentContexts().hasOwnProperty(contextName)
      );
      if (nameWithoutSuchContext) {
        throw new Error(`There is no such context name ${nameWithoutSuchContext}.`);
      }

      return this.renderPreparedMap(contextArray, getCurrentContexts());
    }

    renderUsingDict(contextDict: IContextMap) {
      const propsMap: { [key: string]: any } = {};

      return this.renderPreparedMap(Object.keys(contextDict), contextDict);
    }

    render() {
      if (Array.isArray(contexts)) {
        return this.renderUsingArray(contexts);
      }

      return this.renderUsingDict(contexts);
    }
  }

  // Describe dependencies to automatically resolver
  if (Component.contextDependency && Array.isArray(Component.contextDependency)) {
    if (Array.isArray(contexts)) {
      Wrap.contextDependency = [...Component.contextDependency, ...contexts];
    } else {
      // We detect dependencies between different context using there names
      Wrap.contextDependency = [...Component.contextDependency, ...Object.keys(contexts)];
    }
  } else {
    if (Array.isArray(contexts)) {
      Wrap.contextDependency = contexts;
    } else {
      // We detect dependencies between different context using there names
      Wrap.contextDependency = Object.keys(contexts);
    }
  }

  return hoistStatics(Wrap, Component);
};
