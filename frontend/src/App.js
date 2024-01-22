
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Page404 from './components/Page404.jsx';
import SingupPage from './components/SingupPage.jsx';
import InitialPage from './components/InitialPage.jsx';
import LoginContext from './contexts';
import Chat from './components/Chat.jsx';
import NavbarHeader from './components/Navbar.jsx';
import { actions as globalActions } from './slices/globalSlice.js';

const ContextProvider = ({ children }) => {
const [count, setCount] = useState(null);

return (
  <LoginContext.Provider value={{ count, setCount }}>
    {children}
  </LoginContext.Provider>
);
};

const App = () => {
  const lang = useSelector((state) => state.langState.language);
useEffect(() => {}, [lang]);

const dispatch = useDispatch();
const socket = io();
socket.on('newMessage', (payload) => {
  dispatch(globalActions.addMessage(payload));
  const messageBox = document.getElementById('messages-box');
  messageBox.scrollTop = messageBox.scrollHeight;
});
socket.on('newChannel', (payload) => {
  dispatch(globalActions.addChannel(payload));
});
socket.on('removeChannel', (payload) => {
  dispatch(globalActions.removeChannel(payload.id));
});
socket.on('renameChannel', (payload) => {
  dispatch(globalActions.renameChannel(payload));
});

return (
  <ContextProvider>
    <div className='d-flex flex-column h-100'>
    <NavbarHeader />

    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<InitialPage />} />
        <Route path='/signup' element={< SingupPage />} />
      </Routes>
    </BrowserRouter>

    </div>
  </ContextProvider>
  )
}

export default App;
