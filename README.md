# react-provides

React-providers is a library which helps you to work and manage React.Context components. The library offers you:

- the single location to place your context models;
- simple syntax with HOC components like react-redux.connect;
- an easy way to include another context when it became required;
- working with dependencies between your contexts. So you should just describe dependencies and react-providers will build a correct hierarchy for you. You can see comments example to get more information about managing dependencies;
- This library depends only on `hoist-non-react-statics`, so you wouldn't get a lot of npm modules after installing.
- Implement your own business logic in contexts using react-lifecycle methods or methods that could be accessible from Consumers.

## Install

```
yarn add react-providers
```

or

```
npm install --save react-providers
```

## Usage step by step

### Step 1: Create your context react component:

Implement your own React.Component using React.Context:

https://github.com/xnimorz/react-providers/blob/master/examples/src/models/todoMVC/todos.js — in this file we use react lifecycle methods to store updates in localStorage.

```javascript
import React from 'react';

const TodosContext = React.createContext();
class TodosContextProvider extends React.Component {
  state = {
    list: lsData || [],
  };
  // We can use react lifecycle methods to organise our work!
  componentDidUpdate() {}

  // You can get access to the methods from context consumer
  // This methods like reducers in Redux changes the state of application, but using react api
  add = (todo) => {
    this.setState((state) => ({
        list: [
          ...state.list,
          { id: 1 + Math.max(0, ...state.list.map((todo) => todo.id)), text: todo, completed: false },
        ],
      },
    }));
  };

  render() {
    // describe data that will be Context.Provider value (we can use here memoization, or move it to state to avoid unnecessary rerenders)
    const value = {
      // our data
      data: this.state,
      // our methods
      add: this.add,
    };

    // Provide value to consumer
    return <TodosContext.Provider value={value}>{this.props.children}</TodosContext.Provider>;
  }
}

// Each module should provide 2 components — Consumer and Provider
export default {
  Consumer: TodosContext.Consumer,
  Provider: TodosContextProvider,
};
```

### Step 2: Add the context to react-providers.AppProvider:

Then, you can add your providers to the AppProvider:

```javascript
import React from 'react';
import reactDOM from 'react-dom';
import { AppProvider } from 'react-providers';
import todos from './path/to/todos';

reactDOM.render(
  <AppProvider contexts={{ todos }}>
    <Example>
      YourApplicationIsHere
    </Example>
  <AppProvider/>
);
```

### Step 3: Getting access to data from the context

We can use `use` HOC to get access to data that we store with `AppProvider` component:

```javascript
import React from 'react';
import { use } from 'react-providers';

class Example extends React.Component {
  componentDidMount() {
    // We'll get access to methods
    this.props.todos.add('New todo');
  }
  render() {
    // And data
    console.log(this.props.todos.data.list); // first time we'll get [], and second time [{id: 1, text: 'New todo', completed: false}]
    return 'SomeData';
  }
}

export default use('todos')(Example);
```

See more examples here: https://xnimorz.github.io/react-providers/

### Step 4 (optional): create context which depends on another context

`AppProvider` automatically builds correct Context tree that resolves dependencies between contexts. To get access from one context to another you can use `use` HOC:

```javascript
import React from 'react';
import { AppProvider, use } from 'react-providers';

const A = React.createContext({});
class AProvider extends React.Component<{}, { data: string }> {
  state: Readonly<{ data: string }> = {
    data: 'A Context',
  };

  render() {
    return <A.Provider value={this.state}>{this.props.children}</A.Provider>;
  }
}

const aContext: IContext = {
  Consumer: A.Consumer,
  Provider: AProvider,
};

const B = React.createContext({});
class BProvider extends React.Component<{}, { data: string }> {
  state: Readonly<{ data: string }> = {
    data: 'B Context',
  };

  render() {
    console.log(this.props.a.data); // 'A Context'

    return <B.Provider value={this.state}>{this.props.children}</B.Provider>;
  }
}

const bContext: IContext = {
  Consumer: B.Consumer,
  // Describe BContext depends on AContext
  Provider: use('a')(BProvider),
};

ReactDOM.render(<AppProvider contexts={{ a: aContext, b: bContext }} />);
```

## Motivation

## Dependencies resolver

This library resolves automatically dependencies between Providers. It means you can create two contexts AContext and BContext. BContext can depend on AContext, and the application will work correctly.

The main limitation is you should create cyclic dependencies. e.g. BContext can depend on AContext, but AContext can't depend on BContext simultaneously.
