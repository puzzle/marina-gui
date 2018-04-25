import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from './App';

const mockStore = configureMockStore([thunk]);
jest.mock('../i18n/available');
jest.mock('../i18n/translate');
jest.mock('../i18n/index');

it('renders without crashing', () => {
  // given
  const store = mockStore({});

  // when
  const wrapper = shallow(<App store={store}/>).dive();

  // then
  expect(wrapper.find('div#main').length).toBe(1)
});
