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
        <li>simple syntax with HOC components like react-redux.connect;</li>

        <li>the single location to place your context models;</li>

        <li>
          to implement your own business logic in contexts using familiar React components and react-lifecycle methods;
        </li>

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
      <div>
        See all docs and step-by-step usage on GitHub:{' '}
        <a href="https://github.com/xnimorz/react-providers">https://github.com/xnimorz/react-providers</a>
      </div>
    </div>
  );
}
