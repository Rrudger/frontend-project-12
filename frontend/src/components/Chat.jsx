import React, { useEffect } from 'react';
import {
  Container,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { actions as globalActions } from '../slices/globalSlice.js';
import axios from 'axios';
import ChatPage from './ChatPage.jsx';

const Chat = () => {
  const dispatch = useDispatch();
  let token = null;
  useEffect(() => {
    token = localStorage.getItem('token');
    //console.log(token)
   if (token) {
     axios.get('/api/v1/data', { headers: {
    Authorization: `Bearer ${token}`,
  },
})
.then((response) => {
  //console.log(response.data)
  dispatch(globalActions.setStorage(response.data));

})
.catch(() => console.log(`error`));
   } else {
     window.open('/login', '_self')
   }
  }, []);



  return (
    <Container className='h-100 my-2 mb-3 overflow-hidden rounded shadow'>
      <ChatPage />
    </Container>
  )
};

export default Chat;
