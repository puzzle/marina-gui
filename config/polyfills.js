'use strict';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

// special setup for tests only
if (process.env.NODE_ENV === 'test') {

  // In tests, polyfill requestAnimationFrame and localStorage since jsdom
  // doesn't provide it yet.
  // We don't polyfill it in the browser--this is user's responsibility.
  require('raf').polyfill(global);
  require('jest-localstorage-mock');

  // setup enzyme with the correct adapter
  const Adapter = require('enzyme-adapter-react-16');
  require('enzyme').configure({adapter: new Adapter()});
}
