export enum ContextStatuses {
  PENDING = 'pending',
  PROCESSING = 'processing',
  INCLUDED = 'included',
}

export interface IComponentAdditionals {
  contextDependency?: string[];
  displayName?: string;
  name?: string;
}

export interface IContext {
  Provider: React.ComponentType<any> & IComponentAdditionals;
  Consumer: React.ComponentType<any>;
  status?: ContextStatuses;
}

export interface IContextMap {
  [key: string]: IContext;
}
