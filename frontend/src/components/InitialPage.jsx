import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Image,
  FloatingLabel,
  Form,
  Button,
  Toast,
} from 'react-bootstrap';
import * as yup from 'yup';
import axios from 'axios';

const InitialPage = () => {
const schema = yup.string().required('Пожалуйста, заполните это поле.');

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const login = formData.get('login');
  const password = formData.get('password');
  schema.validate(login)
    .catch(error => {
      document.getElementById('loginInput').focus();
      setFocus('login');
      setError(error.message);
    })
    .then((result) => {
      if (result ) {
        setError(null);
        schema.validate(password)
        .catch(error => {
          document.getElementById('passwordInput').focus();
          setFocus('password');
          setError(error.message);
        })
        .then((result) => {
          if (result) {
            setError(null);
            axios.post('/api/v1/login', { username: login, password: password })
            .then((response) => {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('login', login);
              window.open('/', '_self');
            })
            .catch(() => {
              setErrorForm('error')
            })

        }
        })
      }
    })
  }




useEffect(() => {
  document.getElementById(`loginInput`).focus();
 document.addEventListener("click", function () {
  if (focus) setFocus(null);
});
}, []);

const [error, setError] = useState(null);
const [focus, setFocus] = useState('login');
const [errorForm, setErrorForm] = useState(null);

const showError = (field) => {
  return !error ? false : focus !== field ? false : true;
}


  return (
    <div className='container-fluid h-100'>
      <Row className='justify-content-center align-content-center h-100'>
        <Col className='col-12 col-md-8 col-xxl-6'>
          <Card className='shadow-sm'>
            <Card.Body as={Row} className='p-5'>
              <Col className='col-12 col-md-6 d-flex justify-content-center align-content-center'>
                <Image src="/assets/avatar.jpg" id='mainPageImage' className='align-self-center rounded-circle' alt='Войти'/>
              </Col>
              <Col className='col-12 col-md-6 mt-3 mt-mb-0'>
              <h1 className='mb-4 text-center'>Войти</h1>

              <Form onSubmit={handleSubmit}>

                <FloatingLabel controlId="loginInput"
                label="Ваш ник"
                className="mb-3">
                <Form.Control onChange={() => {if(focus) setFocus(null)}} name='login' className={errorForm && 'is-invalid'} placeholder="" />
                { showError('login') &&
                <Toast className='d-inline-flex position-fixed z-3 border border-danger'>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>}
              </FloatingLabel>

              <FloatingLabel controlId="passwordInput"
              label="Пароль"
              className="mb-4">
              <Form.Control onChange={() => {if(focus) setFocus(null)}} name='password' className={errorForm && 'is-invalid'} placeholder="" />
              { showError('password') &&
              <Toast className='d-inline-flex position-fixed z-3 border border-danger'>
                <Toast.Body>{error}</Toast.Body>
              </Toast>}
              { errorForm &&
              <Toast className='d-inline-flex position-fixed z-3 text-white bg-danger border border-danger'>
                <Toast.Body>Неверные имя пользователя или пароль</Toast.Body>
              </Toast>}
            </FloatingLabel>

      <Button variant="outline-primary" className='mb-3 w-100' type="submit">
        Войти
      </Button>
    </Form>
              </Col>
            </Card.Body>
            <Card.Footer className='p-4'>
              <div className='text-center'>
                <span>Нет аккаунта? </span>
                <a href="/signup">Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>

  )
};

export default InitialPage;
