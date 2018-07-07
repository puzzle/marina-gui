import { applyMiddleware, combineReducers, createStore } from 'redux';
import { localeReducer as locale } from 'react-localize-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { alert } from './alert.reducer';
import { authReducers } from '../auth';
import { employeeReducers } from '../employee';

const loggerMiddleware = createLogger();
export const store = createStore(
  combineReducers({
    locale,
    alert,
    ...authReducers,
    ...employeeReducers,
  }),
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
  ),
);
