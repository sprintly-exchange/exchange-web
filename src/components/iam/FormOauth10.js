import React from 'react';
import { Form, Input } from 'antd';

const FormOauth10 = () => {
  return (
    <>
      <Form.Item label="OAUTH 1.0" name="oAuth10" rules={[{ required: true, message: 'oAuth1.0' }]}><Input /></Form.Item>
    </>
  );
};

export default FormOauth10;
