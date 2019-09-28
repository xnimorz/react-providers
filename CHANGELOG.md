# 2.0.2

- Up dev dependencies to get rid of security vulnerabilities 
- Remove examples and all excess files from the package

# 2.0.1

- Fix type of IContext from

```javascript
export interface IContext {
  Provider: React.ComponentType & IComponentAdditionals;
  Consumer: React.ComponentType;
  status?: ContextStatuses;
}
```

to

```javascript
export interface IContext {
  Provider: React.ComponentType<any> & IComponentAdditionals;
  Consumer: React.ComponentType<any>;
  status?: ContextStatuses;
}
```

# 2.0

- HOC `use` can accept `array<string>` and objects besides `string`. If you want to use the object, it should be:

```javascript
export interface IContextMap {
  [key: string]: Context;
}
```

Where Context is an object, that have two components: `Provider` and `Consumer`.

- HOC `use` can be used without `AppProvider`:

```javascript
const todosContext = React.createContext(['task1', 'task2']);
function MyComponent({ todos }) {
  console.log(todos); // ['task1', 'task2']
  return <div />;
}
const Wrapped = use({ todos: todosContext })(MyComponent);
ReactDom.render(<Wrapped />, document.qeurySelector('#app'));
```

- When you use array, or object with several fields in HOC `use`, the component won't render excess components. Let's compare:

`use({a: AContext, b: BContext})(Component)` or `use('a', 'b')(Component))`:

```javascript
<Use(Component)>
  <AConsumer>
    <BConsumer>
      <Component a={aValue} b={bValue} />
    </BConsumer>
  </AConsumer>
</Use(Use(Component))>
```

VS

`use('a')(use('b')(Component))`:

```javascript
<Use(Use(Component))>
  <AConsumer>
    <Use(Component)>
      <BConsumer>
        <Component a={aValue} b={bValue} />
      </BConsumer>
    </Use(Component)>
  </AConsumer>
</Use(Use(Component))>
```

- `AppProviders` has its own display name `AppProvider` now
- Added `size-limit` to project. The whole project is fewer than 2 Kb (actually 1.88 Kb).
- Added new unit tests to catch cyclic dependencies, complex dependencies and working with different types (arrays, objects) in HOC `use`
- Project is divided into several separate components.
- Examples now use objects in `use` section.

## 1.0

- `AppProvider` allows creating a centralized place to store your contexts
- HOC `use` allows plug context to your components
