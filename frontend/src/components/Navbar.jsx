import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Button,
  ButtonGroup,
  ToggleButton,
  Navbar,
} from 'react-bootstrap';
import { uniqueId } from 'lodash';
import { actions as langActions } from '../slices/lang.js';
import i18n from '../i18n';

const LaBtnsGroup = ({ radios, radioValue, handleChangeLang }) => (
  <ButtonGroup>
    {radios.map((radio, idx) => (
      <ToggleButton
        key={uniqueId()}
        id={`${idx}-radio`}
        type="radio"
        variant="outline-secondary"
        name="radio"
        value={radio}
        checked={radioValue === radio}
        onChange={handleChangeLang}
      >
        {radio}
      </ToggleButton>
    ))}
  </ButtonGroup>
);

const NavbarHeader = () => {
  const dispatch = useDispatch();
  const lang = localStorage.getItem('lang') || 'ru';
  const token = localStorage.getItem('token');
  const radios = ['ru', 'en'];
  const [radioValue, setRadioValue] = useState(lang);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.setItem('lang', 'ru');
    window.open('/login', '_self');
  };

  const handleChangeLang = (e) => {
    setRadioValue(e.currentTarget.value);
    localStorage.setItem('lang', e.currentTarget.value);
    dispatch(langActions.setLanguage(e.currentTarget.value));
  };

  return (
    <Navbar className="navbar-expand-lg navbar-light shadow-sm bg-white mb-3">
      <Container>
        <Navbar.Brand href="/">
          Hexlet Chat
        </Navbar.Brand>
        <LaBtnsGroup radios={radios} radioValue={radioValue} handleChangeLang={handleChangeLang} />
        {token
          && (
          <Button onClick={handleLogout}>
            {i18n.t('buttons.logOut')}
          </Button>
          )}
      </Container>
    </Navbar>
  );
};

export default NavbarHeader;
