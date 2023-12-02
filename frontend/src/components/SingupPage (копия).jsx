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


const SingupPage = () => {
  useEffect(() => {
    document.getElementById(`loginInput`).focus();
    document.addEventListener("click", function () {
      if (focus) setFocus(null);
    });
  }, []);

  function repeatPassword(message) {
    return this.test("repeatPassword", message, function (value) {
      const password = document.getElementById('passwordInput').value;
      if (value !== password) return false;
      return true;
  });
}
  yup.addMethod(yup.string, "repeatPassword", repeatPassword);
  const loginSchema = yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов');

  const passwordSchema = yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов');

  const repeatPasswordSchema = yup.string()
    .repeatPassword('Пароли должны совпадать');



  const [errorLogin, setErrorLogin] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorRepeatPassword, setErrorRepeatPassword] = useState(null);
  const [focus, setFocus] = useState('login');
  //const [errorForm, setErrorForm] = useState(null);


  //const showError = (field) => {
    //return !error ? false : focus !== field ? false : true;
  //}
  const schemaList = {
    'login': loginSchema,
    'password': passwordSchema,
    'repeatPassword': repeatPasswordSchema,
  };
  const errorsList = {
    'login': setErrorLogin,
    'password': setErrorPassword,
    'repeatPassword': setErrorRepeatPassword,
  }

  const handleOnChange = (field) => (e) => {
    e.preventDefault();
    if(focus) setFocus(null);
    const schema = schemaList[field];
    const errorSetter = errorsList[field];
    schema.validate(e.target.value)
      .catch(error => {
        errorSetter(error.message);
      })
      .then((result) => {
        if (result ) {
          errorSetter(null);
        }
      })
    //console.log(result)


  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('test submit');
  }

  return (
    <div className='container-fluid h-100'>
      <Row className='justify-content-around align-content-center h-100'>
        <Col className='col-12 col-md-8 col-xxl-6'>
          <Card className='shadow-sm'>
            <Card.Body as={Row} className='p-5 d-flex flex-column flex-md-row justify-content-around align-items-center'>
              <Col className='d-flex justify-content-center'>
                <Image src="/assets/avatar_1.jpg" id='mainPageImage' className='rounded-circle' alt='Регистрация'/>
              </Col>
              <Form onSubmit={handleSubmit} className='w-50 me-5'>
                <h1 className='mb-5 text-center'>Регистрация</h1>

                <FloatingLabel controlId="loginInput"
                  label="Имя пользователя"
                  className="mb-3">
                  <Form.Control onChange={handleOnChange('login')} name='login' className={errorLogin && 'is-invalid'} placeholder="" />
                  {errorLogin &&
                  <Toast className='d-inline-flex position-fixed z-3 border border-danger'>
                    <Toast.Body>{errorLogin}</Toast.Body>
                  </Toast>}
                </FloatingLabel>

                <FloatingLabel controlId="passwordInput"
                  label="Пароль"
                  className="mb-4">
                  <Form.Control onChange={handleOnChange('password')} name='password' className={errorPassword && 'is-invalid'} placeholder="" />
                  {errorPassword &&
                  <Toast className='d-inline-flex position-fixed z-3 border border-danger'>
                    <Toast.Body>{errorPassword}</Toast.Body>
                  </Toast>}
                </FloatingLabel>

                <FloatingLabel controlId="passwordRepeatInput"
                  label="Повтор пароля"
                  className="mb-4">
                  <Form.Control onChange={handleOnChange('repeatPassword')} name='repeatPassword' className={errorRepeatPassword && 'is-invalid'} placeholder="" />
                  {errorRepeatPassword &&
                  <Toast className='d-inline-flex position-fixed z-3 border border-danger'>
                    <Toast.Body>{errorRepeatPassword}</Toast.Body>
                  </Toast>}
                </FloatingLabel>

                <Button variant="outline-primary" className='mb-3 w-100' type="submit">
                  Зарегистрироваться
                </Button>
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>

  )
}

export default SingupPage;
