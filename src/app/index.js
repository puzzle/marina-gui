import { alert } from './alert.reducer';

export * from './alert.actions';
export { default as App } from './App';
export * from './history';
export * from './store';

export const appReducers = {
  alert,
};
