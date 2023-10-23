import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  FloatingLabel,
} from 'react-bootstrap';
import { Form as BootstrapForm } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const InitialPage = () => {
  const SignupSchema = Yup.object().shape({
  login: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв'),
  password: Yup.string(),
});

useEffect(() => {
 const inputEl = document.getElementById('loginInput');
 inputEl.focus()
}, []);

  return (
    <div className='container-fluid h-100'>
      <Row className='justify-content-center align-content-center h-100'>
        <Col className='mt-5 col-12 col-md-8 col-xxl-6'>
          <Card className='shadow-sm'>
            <Card.Body as={Row} className='p-5'>
              <Col className='col-12 col-md-6 d-flex justify-content-center align-content-center'>
                <Image src="/assets/avatar.jpg" id='mainPageImage' className='align-self-center rounded-circle' alt='Войти'/>
              </Col>
              <Col className='col-12 col-md-6 mt-3 mt-mb-0'>
              <h1 className='mb-4 text-center'>Войти</h1>
              <Formik
                initialValues={{
                  login: '',
                  password: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={ (values) => {
                  console.log(values);
                }}
                >
                {({ errors, touched }) => (
                  <Form as={BootstrapForm}>
                  <FloatingLabel controlId="loginInput" label="Ваш ник" className="mb-3" autoFocus>
                  <Field as={BootstrapForm.Control} name='login' placeholder='Ваш ник'/>
            {errors.login && touched.login ? (
                    <div>{errors.login}</div>
                  ) : null}
                  </FloatingLabel>

                  <FloatingLabel controlId="passwordInput" label="Пароль" className="mb-3">
                  <Field as={BootstrapForm.Control} name="password" placeholder='Пароль'/>
                  {errors.password && touched.password ? <div>{errors.password}</div> : null}
                  </FloatingLabel>

                  <Button variant='outline-primary' className='w-100 mb-3' type="submit">Войти</Button>
                  </Form>
                )}
                </Formik>
              </Col>
            </Card.Body>
            <Card.Footer className='p-4'>
              <div className='text-center'>
                <span>Нет аккаунта?</span>
                <span> Регистрация</span>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>

  )
};

export default InitialPage;
