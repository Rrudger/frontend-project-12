import React from 'react';
import {
  Container,
  Button,
  Navbar,
} from 'react-bootstrap';

const NavbarHeader = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    window.open('/login', '_self');
  }

  return (
    <Navbar className='navbar-expand-lg navbar-light shadow-sm bg-white mb-3'>
      <Container>
        <Navbar.Brand href="/">
          Hexlet Chat
        </Navbar.Brand>
        {token && <Button onClick={handleLogout}>Выйти</Button>}
      </Container>
    </Navbar>
  )
};

export default NavbarHeader;
