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
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';
import { actions as globalActions } from '../slices/globalSlice.js';
import i18n from '../i18n';

function customValidator(message, channelsList) {
  return this.test('customValidator', message, (value) => {
    if (channelsList.includes(value)) return false;
    return true;
  });
}

const ChatPage = () => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [modalId, setModalId] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showModal && modalMode !== 'delete') document.getElementById('modalInput').focus();
  });

  filter.loadDictionary('en');
  filter.add(filter.getDictionary('ru'));
  const dispatch = useDispatch();

  const setCurrentId = (id) => dispatch(globalActions.setCurrentChannel(id));
  const data = useSelector((state) => state.globalState);
  const messages = useSelector((state) => state.globalState.messages)
    .filter((message) => message.channelId === data.currentChannelId);
  const channels = useSelector((state) => state.globalState.channels)
    .map((channel) => channel.name);
  const currentChannel = data.channels
    .filter((channel) => channel.id === data.currentChannelId)[0];
  const login = useSelector((state) => state.globalState.currentUser);
  const lastChannelAddedBy = useSelector((state) => state.globalState.lastChannelAddedBy);

  const socket = io();

  useEffect(() => {
    if (channels.length !== count) {
      if (login === lastChannelAddedBy && lastChannelAddedBy !== null) {
        const list = document.getElementById('channel-box').children;
        setCurrentId(Number(list[list.length - 1].id));
        dispatch(globalActions.setLastChannelAddedBy(null));
      }
    }
  });

  yup.addMethod(yup.string, 'customValidator', customValidator);
  const schema = yup.string()
    .required(i18n.t('toasts.requiredField'))
    .customValidator(i18n.t('toasts.unique'), channels)
    .min(3, i18n.t('toasts.min3characters'))
    .max(20, i18n.t('toasts.min3characters'));

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (mode, id = null) => () => {
    setModalId(id);
    setModalMode(mode);
    setShowModal(true);
  };

  const btnClasses = cn(
    'btn-group-vertical outline-secondary bg-white border-0',
    {
      disabled,
    },
  );

  const callToast = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleInputChange = (e) => (
    e.target.value.length === 0 ? setDisabled(true) : setDisabled(false));
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const inputData = new FormData(e.target);
    setDisabled(true);
    const message = filter.clean(inputData.get('message'));
    if (message.length !== 0) {
      socket.emit('newMessage', { body: message, channelId: data.currentChannelId, username: login });
      e.target.reset();
    }
  };
  const handleAddChannel = (e) => {
    e.preventDefault();
    const inputData = new FormData(e.target);
    schema.validate(inputData.get('newValue'))
      .catch((validateError) => {
        setError(validateError.message);
      })
      .then((result) => {
        if (result) {
          setError(null);
          socket.emit('newChannel', { name: filter.clean(result) });
          handleCloseModal();
          dispatch(globalActions.setLastChannelAddedBy(login));
          setCount(document.getElementById('channel-box').children.length);
          callToast(i18n.t('toasts.channelCreated'));
        }
      });
  };

  const handleDeleteChannel = (id) => (e) => {
    e.preventDefault();
    socket.emit('removeChannel', { id });
    handleCloseModal();
    callToast(i18n.t('toasts.channelDeleted'));
  };

  const handleRenameChannel = (id) => (e) => {
    e.preventDefault();
    const inputData = new FormData(e.target);
    schema.validate(inputData.get('newValue'))
      .catch((renameError) => {
        setError(renameError.message);
      })
      .then((result) => {
        if (result) {
          setError(null);
          socket.emit('renameChannel', { id, name: result });
          handleCloseModal();
          callToast(i18n.t('toasts.channelRenamed'));
        }
      });
  };

  const chooseHandleSubmit = () => {
    switch (modalMode) {
      case 'delete':
        return handleDeleteChannel(modalId);
      case 'rename':
        return handleRenameChannel(modalId);
      default:
        return handleAddChannel;
    }
  };

  useEffect(() => {
    document.getElementById('input').focus();
  }, [currentChannel]);

  return (
    <Row className="h-100 bg-white flex-md-row">
      <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 mb-2 ps-4 pe-2 p-4 justify-content-between">
          <b>{i18n.t('headers.channels')}</b>
          <Button onClick={handleShowModal('add')} variant="outline-primary" className="btn-hover-primary rounded-1 align-items-center justify-content-center align-self-center d-flex p-0" style={{ width: '20px', height: '20px' }}>+</Button>
        </div>
        <Nav as="ul" id="channel-box" variant="pills" className="nav-fill flex-column px-2 mb-3 overflow-auto h-100 d-block">
          {data.channels && data.channels.map((channel) => (
            <Nav.Item as="li" key={channel.id} id={channel.id} className="w-100">
              {!channel.removable ? (
                <Button onClick={() => setCurrentId(channel.id)} variant={channel.id === data.currentChannelId && 'secondary'} className="w-100 rounded-0 text-start">
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
              ) : (
                <Dropdown className="w-100 rounded-0 text-start" as={ButtonGroup}>
                  <Button onClick={() => setCurrentId(channel.id)} className="w-100 rounded-0 text-start text-truncate" variant={channel.id === data.currentChannelId && 'secondary'}>
                    <span className="me-1">#</span>
                    {channel.name}
                  </Button>

                  <Dropdown.Toggle id="channelControl" split variant={channel.id === data.currentChannelId && 'secondary'}>

                    <span className="visually-hidden">{i18n.t('other.channelControlLabel')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleShowModal('delete', channel.id)}>{i18n.t('buttons.delete')}</Dropdown.Item>
                    <Dropdown.Item onClick={handleShowModal('rename', channel.id)}>{i18n.t('buttons.rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav.Item>
          ))}
        </Nav>
      </Col>
      <Col className="p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              {data.currentChannelId && <b>{`# ${currentChannel.name}`}</b>}
            </p>
            <span className="text-muted">{i18n.t('other.message', { count: messages.length })}</span>
          </div>
          <div id="messages-box" className="overflow-auto px-5">
            {messages.length !== 0 && messages.map((message) => (
              <div key={message.id} className="text-break mb-2">
                <b>{message.username}</b>
                :
                {message.body}
              </div>
            ))}
          </div>
          <div className="mt-auto px-5 py-3">
            <Form onSubmit={handleSubmitMessage} className="py-1 border rounded-2">
              <InputGroup>
                <Form.Control onChange={handleInputChange} id="input" aria-label={i18n.t('other.messageFieldLabel')} name="message" className="border-0 p-2 ps-2 me-2" placeholder={i18n.t('other.messageField')} />
                <Button className={btnClasses} type="submit">
                  <Image src="/assets/arrow-right-square.svg" id="sendMessageSvg" />
                </Button>
              </InputGroup>
            </Form>
          </div>
        </div>
      </Col>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n.t(`headers.${modalMode}`)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={chooseHandleSubmit()}>
            {modalMode === 'delete'
              ? <p>{i18n.t('headers.sure')}</p>
              : (
                <>
                  <InputGroup>
                    <label htmlFor="modalInput" className="visually-hidden">{i18n.t('other.channelName')}</label>
                    <Form.Control id="modalInput" name="newValue" className={error ? 'mb-2 is-invalid' : 'mb-2'} placeholder={modalMode === 'renameMode' ? currentChannel.name : ''} />
                  </InputGroup>
                  { error && <div className="fs-6 text-danger">{error}</div>}
                </>
              )}
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                {i18n.t('buttons.close')}
              </Button>
              <Button type="submit" variant={modalMode === 'delete' ? 'danger' : 'primary'}>
                {i18n.t('buttons.save')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Row>
  );
};

export default ChatPage;
