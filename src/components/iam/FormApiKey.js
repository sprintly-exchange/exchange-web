import React from 'react';
import { Form, Input } from 'antd';

const FormApiKey = () => {
  return (
    <>
      <Form.Item label="API Key Header" name="apiKeyHeader" rules={[{ required: true, message: 'API Key Header' }]}><Input /></Form.Item>
      <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: 'apiKey' }]}><Input.Password /></Form.Item>
      <Form.Item label="API Secret Header" name="apiKeyHeader" rules={[{ required: false, message: 'API Secret Header' }]}><Input /></Form.Item>
      <Form.Item label="API Secret" name="apiSecret" rules={[{ required: false, message: 'apiSecret' }]}><Input.Password /></Form.Item>
  </>
  );
};

export default FormApiKey;
