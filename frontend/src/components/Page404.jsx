import React from 'react';
import {
  Row,
} from 'react-bootstrap';

const Page404 = () => {
  return (
    <>
      <Row className='bg-light text-center'>
        <h1 className='h4 text-muted mt-4'>Страница не найдена</h1>
        <p className='text-muted'>Но вы можете перейти на
        <a href='/'> главную страницу</a>
        </p>
      </Row>
    </>
  )
};

export default Page404;
