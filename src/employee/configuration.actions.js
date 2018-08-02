import { configurationService } from './configuration.service';

export const configurationConstants = {
  GET_CURRENT_CONFIGURATION_REQUEST: 'GET_CURRENT_CONFIGURATION_REQUEST',
  GET_CURRENT_CONFIGURATION_SUCCESS: 'GET_CURRENT_CONFIGURATION_SUCCESS',
  GET_CURRENT_CONFIGURATION_FAILURE: 'GET_CURRENT_CONFIGURATION_FAILURE',

  SAVE_CONFIGURATION_REQUEST: 'SAVE_CONFIGURATION_REQUEST',
  SAVE_CONFIGURATION_SUCCESS: 'SAVE_CONFIGURATION_SUCCESS',
  SAVE_CONFIGURATION_FAILURE: 'SAVE_CONFIGURATION_FAILURE',
};

export const configurationActions = {
  saveConfiguration,
  getConfiguration,
};

function getConfiguration() {
  return (dispatch) => {
    dispatch(request());

    configurationService.getConfiguration()
      .then(
        configuration => dispatch(success(configuration)),
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: configurationConstants.GET_CURRENT_CONFIGURATION_REQUEST };
  }

  function success(configuration) {
    return {
      type: configurationConstants.GET_CURRENT_CONFIGURATION_SUCCESS,
      configuration,
    };
  }

  function failure(error) {
    return {
      type: configurationConstants.GET_CURRENT_CONFIGURATION_FAILURE,
      error,
    };
  }
}

function saveConfiguration(configuration) {
  return (dispatch) => {
    dispatch(request());

    configurationService.saveConfiguration(configuration)
      .then(
        (updatedConfiguration) => {
          dispatch(success(updatedConfiguration));
          dispatch(getConfiguration());
        },
        error => dispatch(failure(error)));
  };

  function request() {
    return { type: configurationConstants.SAVE_CONFIGURATION_REQUEST };
  }

  function success(updatedConfiguration) {
    return {
      type: configurationConstants.SAVE_CONFIGURATION_SUCCESS,
      configuration: updatedConfiguration,
    };
  }

  function failure(error) {
    return { type: configurationConstants.SAVE_CONFIGURATION_FAILURE, error };
  }
}

