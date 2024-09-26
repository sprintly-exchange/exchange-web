import React from 'react';
import { Form, Input } from 'antd';
const FormOauth20 = () => {

  return (
    <>
    <Form.Item label="OAUTH 2.0" name="oAuth20" rules={[{ required: true, message: 'oAuth2.0' }]}><Input /></Form.Item>
  </>
  );
};

export default FormOauth20;
