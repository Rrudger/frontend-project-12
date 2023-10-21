import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Container,
  Navbar,
} from 'react-bootstrap';
import Page404 from './components/Page404.jsx';
import InitialPage from './components/InitialPage.jsx';

//import Page2 from './components/Test2.jsx';

function App() {
  return (
    <div className='d-flex flex-column h-100'>
    <Navbar className='navbar-expand-lg navbar-light shadow-sm bg-white'>
      <Container>
        <Navbar.Brand href="/">
          Hexlet chat
        </Navbar.Brand>
      </Container>
    </Navbar>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<InitialPage />} />
        <Route path="login" element={<InitialPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
