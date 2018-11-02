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
  Provider: React.ComponentType & IComponentAdditionals;
  Consumer: React.ComponentType;
  status?: ContextStatuses;
}

export interface IContextMap {
  [key: string]: IContext;
}
