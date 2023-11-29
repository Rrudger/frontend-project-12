/* eslint-disable react/prop-types */
import React, { useState }from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page404 from './components/Page404.jsx';
import InitialPage from './components/InitialPage.jsx';
import LoginContext from './contexts';
import Chat from './components/Chat.jsx';
import NavbarHeader from './components/Navbar.jsx';
import { io } from 'socket.io-client';
import { actions as globalActions } from './slices/globalSlice.js';

function App() {
  const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState(10);

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      {children}
    </LoginContext.Provider>
  );
}

  const dispatch = useDispatch();
  const socket = io();
  socket.on('newMessage', (payload) => {
      dispatch(globalActions.addMessage(payload));
      const messageBox = document.getElementById('messages-box');
      messageBox.scrollTop = messageBox.scrollHeight;
  });
  socket.on('newChannel', (payload) => {
    dispatch(globalActions.addChannel(payload))
  });
  socket.on('removeChannel', (payload) => {
    dispatch(globalActions.removeChannel(payload.id))
  });
  socket.on('renameChannel', (payload) => {
    dispatch(globalActions.renameChannel(payload))
  });

  return (
    <LoginProvider>
    <div className='d-flex flex-column h-100'>
    <NavbarHeader />

    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<Chat />} />
        <Route path="login" element={<InitialPage />} />
      </Routes>
    </BrowserRouter>

    </div>
    </LoginProvider>
  );
}

export default App;
