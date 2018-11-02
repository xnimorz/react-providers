# react-providers

React-providers is a library which helps you to work and manage React.Context components. The library offers you:

- simple syntax with HOC components like react-redux.connect;
- the single location to place your context models;
- to implement your own business logic in contexts using familiar React components and react-lifecycle methods;
- an easy way to include another context when it became required;
- to work with dependencies between your contexts. So you should just describe dependencies and react-providers will build a correct hierarchy for you. You can see comments example to get more information about managing dependencies;
- working both in server and client
- this library depends only on `hoist-non-react-statics`, so you wouldn't get a lot of npm modules after installing.

## Contents

- [Demo](#demo)
- [Install](#install)
- [Usage step by step](#usage-step-by-step)
  - [Using only a HOC for context](#using-only-a-hoc-for-context)
  - [Working with the store and connect to it](#working-with-the-store-and-connect-to-it)
- [Developer experience](#developer-experience)
  - [Why I should use react-providers instead of plain react.Context?](#why-i-should-use-react-providers-instead-of-plain-react.context)
  - [About react-providers pros](#about-react-providers-pros)
  - [About redux](#about-redux)
  - [How to work without redux and any other library. Just using react](#how-to-work-without-redux-and-any-other-library.-Just-using-react)
- [Dependencies resolver](#dependencies-resolver)
- [License](#License)

### Demo

Here is several examples: https://xnimorz.github.io/react-providers/

## Install

```
yarn add react-providers
```

or

```
npm install --save react-providers
```

## Usage step by step

This library can work in two mods:

1. Use only HOC for Context
2. Create the store with lots of context components

Let's see how to use library in both ways

### Using only a HOC for context

1. Implement your own React.Component using React.Context or just using React.Context:

```javascript
export const TodosContext = React.createContext(['Do some work', 'Close task in jira']);
```

2. Connect to this context using HOC `use`:

```javascript
import { TodosContext } from './path/to/TodosContext';

function MyComponent({ todos }) {
  console.log(todos); // ['Do some work', 'Close task in jira']
}

export default use({ todos: TodosContext })(MyComponent);
```

### Working with the store and connect to it

#### Step 1: Create your context React component:

Implement your own React.Component using React.Context:

https://github.com/xnimorz/react-providers/blob/master/examples/src/models/todoMVC/todos.js — in this file we use React lifecycle methods to store updates in localStorage.

```javascript
import React from 'react';

const TodosContext = React.createContext();
class TodosContextProvider extends React.Component {
  state = {
    list: lsData || [],
  };
  // We can use React lifecycle methods to organise our work!
  componentDidUpdate() {}

  // You can get access to the methods from context consumer
  // This methods like reducers in Redux changes the state of the application but using React api
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

#### Step 2: Add the context to react-providers.AppProvider:

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

#### Step 3: Getting access to data from the context

We can use `use` HOC to get access to data that we store with `AppProvider` component:

```javascript
import React from 'react';
import { use } from 'react-providers';
import todos from './path/to/todos';

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

export default use({ todos })(Example);
```

See more examples here: https://xnimorz.github.io/react-providers/

#### Step 4 (optional): create context which depends on another context

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

## Developer experience

### Why I should use react-providers instead of plain react.Context?

1. The centralised place to store and manage our logic

You can store your context in one place where you paste AppProvider component (as a rule, it's better to put it at the beginning of React tree).
You won't spend the time to manage dependencies between components. it's enough to declare dependency using `use` HOC in Providers (like in examples above). You have only one limitation — cyclic dependencies aren't allowed.

2. Reduce code wrapping

As a rule, each model, which presented by React.Context component, should have only a single responsibility (SOLID principles). In our React components, we often want to get data from several Consumers. In such cases our code would be:

```javascript
function YourComponent() {
  return (
    <UsersConsumer>
      {(users) =>
        <TopicsConsumer>
          {(topics) =>
            <CommentsConsumer>{(comments) => /*Your data*/ }</CommentsConsumer>
          }
        </TopicsConsumer>
      }
    </UsersConsumer>
  );
}
export default YourComponent;
```

Let's compare this example to the same example with react-providers lib:

```javascript
function YourComponent() {
  const { users, topics, comments } = this.props;
  return (/*Your data*/);
}
// 1) connection using Object:
export default use({
  users: UserContext,
  topics: TopicsContext,
  comments: CommentsContext
})(YourComponent)));
// 2) or using array:
export default use('users', 'topics', 'comments')(YourComponent)));
```

We encapsulated all consumers' logic to our HOC component `use`. In component, we paid attention to _How our component should work and what data it should return_.

### About react-providers pros

React-providers works with React.Context and offers you an easy way to combine and to store Contexts in one place. You work with familiar Components state. It hasn't any additional boilerplate code.
React-providers manage your dependencies between contexts, so you don't mind about the right order of contexts in React components tree.
HOC `use` allows you to describe dependencies using objects, arrays or string.

### About redux

Redux (https://github.com/reduxjs/redux) is a great library that offers you time traveling and to store all application data in one place. It uses actions to describe what happens in application and reducers to implement the data logic of your application. To implement async action creators we can use our own middleware or existed middleware like redux-saga or redux-thunk. Redux offers us a great and pretty clear API to build our applications.
But we'll have lots of boilerplate code to describe all actions, reducers etc. If you create not a too big application you probably don't need redux.

### How to work without redux and any other library. Just using react

On the other hand, you probably don't need redux. Our React components can work without redux. And they do work.
We can implement a method `addTodo` to the React component called `Todos`, which adds a new todo to the list that stored in the component state. Then we can transfer this `addTodo` method as a prop to other components. By this way, components can call `addTodo`.
In described case `addTodo` calls `this.setState` method to set a new state to our `Todos` React component. _`addTodo` implements the reducer pattern in our application._ So `addTodo` is pretty similar to reducers in Redux. Moreover, react.lifecycle methods offer you to implement middlewares logic in react. You can add you own logic to componentDidMount, DidUpdate etc. methods. Consequently, we can work using only React API and React boilerplates to implement both view and business logic, because React already has methods that you need to implement your business logic.

Let's have a look at the way how we can work without redux:

1. We can implement our business or async logic locally using React components. To transfer data from one component to another we can use props.
2. When or if this logic becomes necessary in several places in our application we can move it to React Context.
3. When one context depends on another context we can decompose them and place them in the correct order in React components tree.

OR

When we realize the logic becomes necessary in several places in our app we can move it to React Context and put it to react-providers.AppProvider component. And now we won't mind about where we should add Consumer for context. We just use `use` HOC where we need like react-redux.connect.

## Dependencies resolver

This library resolves automatically dependencies between Providers. It means you can create two contexts AContext and BContext. BContext can depend on AContext, and the application will work correctly.

The main limitation is you should create cyclic dependencies. e.g. BContext can depend on AContext, but AContext can't depend on BContext simultaneously.

## License

MIT License
