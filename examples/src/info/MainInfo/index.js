import React from 'react';
import './styles.css';

export default function MainInfo() {
  return (
    <div className="mainInfo">
      <p>
        React-providers is a library which helps you to work and manage React.Context components. The library offers
        you:
      </p>

      <ul>
        <li>the single location to place your context models;</li>

        <li>
          to implement your own business logic in contexts using familiar React components and react-lifecycle methods;
        </li>

        <li>simple syntax with HOC components like react-redux.connect;</li>

        <li>an easy way to include another context when it became required;</li>

        <li>
          to work with dependencies between your contexts. So you should just describe dependencies and react-providers
          will build a correct hierarchy for you. You can see comments example to get more information about managing
          dependencies;
        </li>

        <li>working both in server and client</li>

        <li>
          this library depends only on <code>hoist-non-react-statics</code>, so you wouldn't get a lot of npm modules
          after installing.
        </li>
      </ul>

      <h2 id="install">Install</h2>

      <code className="mainInfo__code">yarn add react-providers</code>

      <p>or</p>

      <code className="mainInfo__code">npm install --save react-providers</code>

      <h2 id="usagestepbystep">Usage step by step</h2>

      <h3 id="step1createyourcontextreactcomponent">Step 1: Create your context React component:</h3>

      <p>Implement your own React.Component using React.Context:</p>

      <p>
        <a
          href="https://github.com/xnimorz/react-providers/blob/master/examples/src/models/todoMVC/todos.js"
          target="_blank"
        >
          https://github.com/xnimorz/react-providers/blob/master/examples/src/models/todoMVC/todos.js
        </a>{' '}
        — in this file we use React lifecycle methods to store updates in localStorage.
      </p>

      <code className="mainInfo__code">{`
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
`}</code>

      <h3 id="step2addthecontexttoreactprovidersappprovider">
        Step 2: Add the context to react-providers.AppProvider:
      </h3>

      <p>Then, you can add your providers to the AppProvider:</p>

      <code className="mainInfo__code">{`
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
`}</code>

      <h3 id="step3gettingaccesstodatafromthecontext">Step 3: Getting access to data from the context</h3>

      <p>
        We can use <code>use</code> HOC to get access to data that we store with <code>AppProvider</code> component:
      </p>

      <code className="mainInfo__code">{`
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
`}</code>

      <p>See more examples here: https://xnimorz.github.io/react-providers/</p>

      <h3 id="step4optionalcreatecontextwhichdependsonanothercontext">
        Step 4 (optional): create context which depends on another context
      </h3>

      <p>
        <code>AppProvider</code> automatically builds correct Context tree that resolves dependencies between contexts.
        To get access from one context to another you can use <code>use</code> HOC:
      </p>

      <code className="mainInfo__code">{`
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
`}</code>

      <h2 id="developerexperience">Developer Experience</h2>

      <h3 id="aboutredux">About redux</h3>

      <p>
        Redux (https://github.com/reduxjs/redux) is a great library that offers you time traveling and to store all
        application data in one place. It uses actions to describe what happens in application and reducers to implement
        the data logic of your application. To implement async action creators we can use our own middleware or existed
        middleware like redux-saga or redux-thunk. Redux offers us a great and pretty clear API to build our
        applications. But we'll have lots of boilerplate code to describe all actions, reducers etc. If you create not a
        too big application you probably don't need redux.
      </p>

      <h3 id="howtoworkwithoutreduxandanyotherlibraryjustusingreact">
        How to work without redux and any other library. Just using react
      </h3>

      <p>
        On the other hand, you probably don't need redux. Our React components can work without redux. And they do work.
        We can implement a method <code>addTodo</code> to the React component called <code>Todos</code>, which adds a
        new todo to the list that stored in the component state. Then we can transfer this <code>addTodo</code> method
        as a prop to other components. By this way, components can call <code>addTodo</code>. In described case{' '}
        <code>addTodo</code> calls <code>this.setState</code> method to set a new state to our <code>Todos</code> React
        component.{' '}
        <em>
          <code>addTodo</code> implements the reducer pattern in our application.
        </em>{' '}
        So <code>addTodo</code> is pretty similar to reducers in Redux. Moreover, react.lifecycle methods offer you to
        implement middlewares logic in react. You can add you own logic to componentDidMount, DidUpdate etc. methods.
        Consequently, we can work using only React API and React boilerplates to implement both view and business logic,
        because React already has methods that you need to implement your business logic.
      </p>

      <p>Let's have a look at the way how we can work without redux:</p>

      <ol>
        <li>
          We can implement our business or async logic locally using React components. To transfer data from one
          component to another we can use props.
        </li>

        <li>
          When or if this logic becomes necessary in several places in our application we can move it to React Context.
        </li>

        <li>
          When one context depends on another context we can decompose them and place them in the correct order in React
          components tree.
        </li>
      </ol>

      <p>OR</p>

      <p>
        When we realize the logic becomes necessary in several places in our app we can move it to React Context and put
        it to react-providers.AppProvider component. And now we won't mind about where we should add Consumer for
        context. We just use <code>use</code> HOC where we need like react-redux.connect.
      </p>

      <h3 id="aboutreactprovidersprops">About react-providers props</h3>

      <p>
        React-providers works with React.Context and offers you an easy way to combine and to store Contexts in one
        place. You work with familiar Components state. It hasn't any additional boilerplate code. React-providers
        manage your dependencies between contexts, so you don't mind about the right order of contexts in React
        components tree.
      </p>

      <h3 id="whenitsbetternottousereactproviders">When it's better not to use react-providers</h3>

      <ol>
        <li>
          If you have very complicated use cases with complicated async logic it could be better to use redux. Any
          regular cases you can easily implement using React Components.
        </li>

        <li>If you already use redux :)</li>
      </ol>

      <h2 id="dependenciesresolver">Dependencies resolver</h2>

      <p>
        This library resolves automatically dependencies between Providers. It means you can create two contexts
        AContext and BContext. BContext can depend on AContext, and the application will work correctly.
      </p>

      <p>
        The main limitation is you should create cyclic dependencies. e.g. BContext can depend on AContext, but AContext
        can't depend on BContext simultaneously.
      </p>
    </div>
  );
}
