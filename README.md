# react-provides

This npm module allows you to use context easily.

## Install

```
yarn add react-providers
```

or

```
npm install --save react-providers
```

## Usage

You can describe your context providers: https://github.com/xnimorz/react-providers/blob/master/examples/CommentsContext.js

Then, you can add your providers to the AppProviders:

```javascript
import { AppProvider } from 'react-providers';
import CommentsContext from './path/to/CommentsContext';

reactDOM.render(
  <AppProvider contexts={[CommentsContext]}>
    <Example>
      YourApplicationIsHere
    </Example>
  <AppProvider/>
);
```

Now any your component can use a context. Let's add CommentsContext to our Example component:

```javascript
import React from 'react';
import { use } from 'react-providers';

class Example extends React.Component {
  render() {
    return this.props.Comments.data;
  }
}

export default use('Comments')(Example);
```

## Dependencies resolver

This library resolves automatically dependencies between Providers. It means you can create two contexts AContext and BContext. BContext can depend on AContext, and the application will work correctly.

The main limitation is you should create cyclic dependencies. e.g. BContext can depend on AContext, but AContext can't depend on BContext simultaneously.
