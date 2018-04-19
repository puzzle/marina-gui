import React from 'react';
import {translate} from 'react-translate';

import './Header.css';

const createOnChangeHandler = (available, onChange) => ({currentTarget}) =>
  onChange(available[currentTarget.selectedIndex]);

const Header = ({available, current, onChange, t}) => (
  <div>
    <h1>{t('title')}</h1>

    <select onChange={createOnChangeHandler(available, onChange)} value={current}>
      {available.map((item, index) =>
        <option key={index}>
          {item}
        </option>
      )}
    </select>
  </div>
);

export default translate('Header')(Header);
