import React from 'react';
import { Form, Input } from 'antd';

const FormBasicAuth = () => {
  return (
    <>
      <Form.Item label="User Name" name="username" rules={[{ required: true, message: 'username' }]}><Input /></Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'password' }]}><Input.Password /></Form.Item>
  </>
  );
};

export default FormBasicAuth;
