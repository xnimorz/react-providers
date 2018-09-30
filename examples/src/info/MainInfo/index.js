import React from 'react';
import './styles.css';

export default function MainInfo({ children }) {
  return (
    <div className="mainInfo">
      React-providers is a library which helps you to work and manage React.Context components. The library offers you:
      <ul>
        <li>simple syntax with HOC components like react-redux.connect;</li>
        <li>the single location to place your context;</li>
        <li>easy way to include another context when it became required;</li>
        <li>
          working with dependencies between your contexts. So you should just describe dependencies and react-providers
          will build a correct hierarchy for you.
        </li>
        <li>
          This library depends only on <code>hoist-non-react-statics</code>, so you wouldn't get a lot of npm modules
          after installing.
        </li>
      </ul>
      {children}
    </div>
  );
}
