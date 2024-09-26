import React from 'react';
import { Form, Input } from 'antd';

const FormJwt = () => {
  return (
    <>
      <Form.Item label="JWT" name="jwt" rules={[{ required: true, message: 'jwt' }]}><Input /></Form.Item>
    </>
  );
};

export default FormJwt;
