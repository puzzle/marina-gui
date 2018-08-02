import {
  handleResponse,
  makeRequestOptions,
  url,
} from '../common/service.helper';

export const configurationService = {
  getConfiguration,
  saveConfiguration,
};

function getConfiguration() {
  return fetch(url('/configuration/my'), makeRequestOptions('GET'))
    .then(handleResponse);
}

function saveConfiguration(configuration) {
  if (configuration.id !== null) {
    return fetch(url(`/configuration/${configuration.id}`), makeRequestOptions('PUT', { body: JSON.stringify(configuration) }))
      .then(handleResponse);
  }
  throw new Error('configuration id cannot be null!');
}
