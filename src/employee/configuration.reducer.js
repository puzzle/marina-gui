import { configurationConstants } from './configuration.actions';

const initialState = {};

export function configuration(state = initialState, action) {
  switch (action.type) {
    // new user employee state
    case configurationConstants.GET_CURRENT_CONFIGURATION_SUCCESS:
      return {
        configuration: action.configuration,
      };

    // empty states
    case configurationConstants.GET_CURRENT_CONFIGURATION_REQUEST:
    case configurationConstants.GET_CURRENT_CONFIGURATION_FAILURE:
    case configurationConstants.SAVE_CONFIGURATION_REQUEST:
    case configurationConstants.SAVE_CONFIGURATION_SUCCESS:
    case configurationConstants.SAVE_CONFIGURATION_FAILURE:
      return {};

    default:
      return state;
  }
}

