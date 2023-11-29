import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Image,
  Nav,
  Form,
  InputGroup,
  Modal,
  Dropdown,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import cn from 'classnames';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { actions as globalActions } from '../slices/globalSlice.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.globalState);
  const messages = useSelector((state) => state.globalState.messages).filter((message) => message.channelId === data.currentChannelId)
  const channels = useSelector((state) => state.globalState.channels).map((channel) => channel.name);
  const currentChannel = data.channels.filter((channel) => channel.id === data.currentChannelId)[0];

  const socket = io();
  const login = localStorage.getItem('login');
  const messageText = (numMessages) => {
    const num = numMessages > 20 ? numMessages % 10 : numMessages;
    let text = '';
    switch(num) {
      case 1:
        text = 'сообщение';
        break;
      case 2:
      case 3:
      case 4:
        text = 'сообщения';
        break;
      default:
        text = 'сообщений';
    }
    return text;
  };

  function customValidator(message) {
    return this.test("customValidator", message, function (value) {
      if (channels.includes(value)) return false;
      return true;
  });
}
  yup.addMethod(yup.string, "customValidator", customValidator);
  const schema = yup.string().required('Обязательное поле').customValidator('Должно быть уникальным');


  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (mode, id = null) => () => {
    setModalId(id);
    setModalMode(mode);
    setShowModal(true);
  };
  const [error, setError] = useState(null);
  useEffect(() => {
    if (showModal && modalMode !== 'deleteMode') document.getElementById(`modalInput`).focus();
  }, [showModal]);
  const [modalMode, setModalMode] = useState(null);
  const [modalId, setModalId] = useState(null);

  const setCurrentId = (id) => {
    dispatch(globalActions.setCurrentChannel(id))
  };
  const [disabled, setDisabled] = useState(true);
  const btnClasses = cn('btn-group-vertical outline-secondary bg-white border-0',
{
  'disabled': disabled,
});



const callToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
  })
}

const handleInputChange = (e) => e.target.value.length === 0 ? setDisabled(true) : setDisabled(false);
const handleSubmitMessage = (e) => {
  e.preventDefault();
  const inputData = new FormData(e.target);
  setDisabled(true);
  socket.emit('newMessage', { body: inputData.get('message'), channelId: data.currentChannelId, username: login });
   e.target.reset();
  //location.reload();
};
const handleAddChannel = (e) => {
  e.preventDefault();
  const inputData = new FormData(e.target);
  schema.validate(inputData.get('newValue'))
    .catch(error => {
      setError(error.message);
    })
    .then((result) => {
      if (result ) {
        setError(null);
        socket.emit('newChannel', { name: result });
        handleCloseModal();
        callToast('Канал создан');
      }
    })
};

const handleDeleteChannel = (id) => (e) => {
  e.preventDefault();
  socket.emit('removeChannel', { id: id });
  handleCloseModal();
  callToast('Канал удален');
};

const handleRenameChannel = (id) => (e) => {
  e.preventDefault();
  const inputData = new FormData(e.target);
  schema.validate(inputData.get('newValue'))
    .catch(error => {
      setError(error.message);
    })
    .then((result) => {
      if (result ) {
        setError(null);
        socket.emit('renameChannel', { id: id, name: result });
        handleCloseModal();
        callToast('Канал переименован');
      }
    })
}

useEffect(() => {
  document.getElementById(`input`).focus();
}, [currentChannel]);

  return  (
    <Row className='h-100 bg-white flex-md-row'>
      <Col className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
        <div className='d-flex mt-1 mb-2 ps-4 pe-2 p-4 justify-content-between'>
          <b>Каналы</b>
          <Button onClick={handleShowModal('addMode')} variant='outline-primary' className='btn-hover-primary rounded-1 align-items-center justify-content-center align-self-center d-flex p-0' style={{width: '20px', height: '20px'}}>+</Button>
        </div>
        <Nav as={'ul'} id='channel-box' variant='pills' className='nav-fill flex-column px-2 mb-3 overflow-auto h-100 d-block'>
          {data.channels && data.channels.map((channel) => (
          <Nav.Item as={'li'} key={channel.id} className='w-100'>
            {!channel.removable ? (
            <Button onClick={() => setCurrentId(channel.id)} variant={channel.id === data.currentChannelId && 'secondary'} className='w-100 rounded-0 text-start'>
              <span className='me-1'>#</span>
              {channel.name}
            </Button>) : (
            <Dropdown  className='w-100 rounded-0 text-start'  as={ButtonGroup}>
              <Button onClick={() => setCurrentId(channel.id)} className='w-100 rounded-0 text-start' variant={channel.id === data.currentChannelId && 'secondary'}>
                <span className='me-1'>#</span>
                {channel.name}
              </Button>
              <Dropdown.Toggle split variant={channel.id === data.currentChannelId && 'secondary'} />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleShowModal('deleteMode', channel.id)}>Удалить</Dropdown.Item>
                  <Dropdown.Item onClick={handleShowModal('renameMode', channel.id)}>Переименовать</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>)}
          </Nav.Item>
        ))}
        </Nav>
      </Col>
      <Col className='p-0 h-100'>
         <div className='d-flex flex-column h-100'>
          <div className='bg-light mb-4 p-3 shadow-sm small'>
            <p className='m-0'>
              {data.currentChannelId && <b>{`# ${currentChannel.name}`}</b>}
            </p>
            <span className='text-muted'>{messages.length} {messageText(messages.length)}</span>
          </div>
          <div id='messages-box' className='overflow-auto px-5'>
            {messages.length !==0 && messages.map((message) => (
              <div key={message.id} className='text-break mb-2'>
                <b>{message.username}</b>: {message.body}
              </div>
            ))}
          </div>
          <div className='mt-auto px-5 py-3'>
            <Form onSubmit={handleSubmitMessage} className='py-1 border rounded-2'>
              <InputGroup>
                <Form.Control onChange={handleInputChange} id='input' name='message' className='border-0 p-2 ps-2 me-2' placeholder="Введите сообщение" />
                <Button className={btnClasses} type='submit'>
                  <Image src="/assets/arrow-right-square.svg" id='sendMessageSvg' />
                </Button>
              </InputGroup>
            </Form>
          </div>
         </div>
      </Col>

      <Modal aria-labelledby="contained-modal-title-vcenter"
      centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
          {modalMode === 'addMode' ? 'Добавить канал' : modalMode === 'renameMode' ? 'Переименовать канал' : 'Удалить канал'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={modalMode === 'addMode' ? handleAddChannel : modalMode === 'renameMode' ? handleRenameChannel(modalId) : handleDeleteChannel(modalId)}>
          {modalMode === 'deleteMode' ?
            <p>Уверены?</p>
           : <>
           <InputGroup>
            <Form.Control id='modalInput' name='newValue' className={error ? 'mb-2 is-invalid' : 'mb-2'} placeholder={modalMode === 'renameMode' ? currentChannel.name : ''}/>
          </InputGroup>
          { error && <div className='fs-6 text-danger'>{error}</div>}
          </>
        }
          <div className='d-flex justify-content-end'>
          <Button variant="secondary" onClick={handleCloseModal} className='me-2'>
            Отменить
          </Button>
          <Button type='submit' variant={modalMode === 'deleteMode' ? 'danger' : "primary"}>
            Отправить
          </Button>
          </div>
        </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Row>
  )
};

export default ChatPage;
