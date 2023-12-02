import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Image,
  FloatingLabel,
  Form,
  Button,
  //Toast,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';


const SingupPage = () => {
  const [formError, setFormError] = useState(null);
  useEffect(() => {
    document.getElementById(`loginInput`).focus();
  }, []);

  const submitNewUser = (user) => {
    axios.post('/api/v1/signup', { username: user.login, password: user.password })
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('login', user.login);
      window.open('/', '_self');
      setFormError(null);
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setFormError('Такой пользователь уже существует')
      }
    })
  }

  function repeatPassword(message) {
    return this.test("repeatPassword", message, function (value) {
      const password = document.getElementById('passwordInput').value;
      if (value !== password) return false;
      return true;
  });
}
  yup.addMethod(yup.string, "repeatPassword", repeatPassword);

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: yup.object().shape({
    login: yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    repeatPassword: yup.string().repeatPassword('Пароли должны совпадать'),
  }),
    onSubmit: values => {
      submitNewUser(values)
    }
  });

  const ToastError = ( errorText ) => {
    return (
      <div className='position-fixed z-3 bg-opacity-75 bg-danger text-white border rounded border-danger m-0 mt-1 p-0'>
        <div className='d-inline-flex m-1 p-0'>{errorText.errorText}</div>
      </div>
    )
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

              <Form onSubmit={formik.handleSubmit} className='w-50 me-5'>
                <h1 className='mb-5 text-center'>Регистрация</h1>

                <FloatingLabel controlId="loginInput"
                  label="Имя пользователя"
                  className="mb-0">
                  <Form.Control
                    name='login'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.login}
                    placeholder=""
                    className={formik.errors.login && formik.touched.login ?
                      'is-invalid': ''}
                  />
                </FloatingLabel>
                {formik.errors.login && formik.touched.login ?
                  <ToastError errorText={formik.errors.login} />
                 : null}

                <FloatingLabel controlId="passwordInput"
                  label="Пароль"
                  className="mt-3">
                  <Form.Control
                    name='password'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder=""
                    className={formik.errors.password && formik.touched.password ?
                      'is-invalid': ''}
                     />
                     </FloatingLabel>
                {formik.errors.password && formik.touched.password ?
                  <ToastError errorText={formik.errors.password} />
                   : null}


                <FloatingLabel controlId="repeatPasswordInput"
                  label="Повтор пароля"
                  className="mt-3">
                  <Form.Control
                    name='repeatPassword'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.repeatPassword}
                    placeholder=""
                    className={formik.errors.repeatPassword && formik.touched.repeatPassword ?
                      'is-invalid': ''}
                     />
                </FloatingLabel>
                {formik.errors.repeatPassword && formik.touched.repeatPassword ?
                <ToastError errorText={formik.errors.repeatPassword} />
                : null}
                {
                  formError && <ToastError errorText={formError} />
                }

                <Button variant="outline-primary" className='mb-3 mt-4 w-100' type="submit">
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
