// src/LoginForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select ,Card, Spin, message} from 'antd';
import {ConnectionSFTP} from '../../models/ConnectionSFTP.mjs'
import FormBasicAuth from '../iam/FormBasicAuth';

const SftpPickup = () => {
  const [form] = Form.useForm();
  
  const [currentAuthForm, setCurrentAuthForm] = useState('');
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);

  const selectAuthOption = (event) => {
    console.log('event',event);
    switch(event){
      case 'basicAuthentication':
        setCurrentAuthForm('basicAuthentication');
        break;
      default:

    }
  };


  const onFinish = (values) => {
    console.log('values:', values);
    const  connectionSFTP = new ConnectionSFTP();
    
    Object.assign(connectionSFTP,values);
    sendData(`${process.env.REACT_APP_API_BASE_URL}/api/pickup`,connectionSFTP);
    console.log('connectionFTP:', connectionSFTP);
    // Handle form submission logic
  };

  async function sendData(url,data){
    const headers = new Headers({"Content-Type": "application/json"},{"accept": "application/json"});
    try{
      const postReq = await fetch(url,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
      });

     const responseData = await postReq.json();
     const cardData = {
      message : `Pickup created with id : ${responseData.id}`
     }
     setCardData(cardData);
     setLoading(false);
     message.info(`A SFTP pickup was created with ID ${responseData.id}.`);
    }catch(error){
      console.log('error',error);
      const cardData = {
        message : error
       }
      setCardData(cardData);
      setLoading(false);
    }
    
  }

  const onFinishFailed = (event) => {

  }

  return (
    <>
    <div>
      <Form  name ="formStpPickup" form={form} layout="horizontal" labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} style={{ maxWidth: 600, }} initialValues={{ remember: true, }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="on">
        <Form.Item label="Connection Name" name="connectionName" rules={[{ required: true, message: 'connectionName' }]}><Input /></Form.Item>
        <Form.Item label="Host" name="host" rules={[{ required: true, message: 'host' }]}><Input /></Form.Item>
        <Form.Item label="Port" name="port" rules={[{ required: true, message: 'port' }]}><Input /></Form.Item>
        <Form.Item label="Retry Interval" name="retryInterval" rules={[{ required: true, message: 'retryInterval' }]}><Input /></Form.Item>
        <Form.Item label="Retry Attemps" name="retryAttemps" rules={[{ required: true, message: 'retryAttemps' }]}><Input /></Form.Item>
        <Form.Item label="Path" name="path" rules={[{ required: true, message: 'path' }]}><Input /></Form.Item>
        <Form.Item label="Authentication Type" name ="authenticationType" value="Select authenticationType" rules={[{ required: true, message: 'authenticationType' }]}>
          <Select onChange={selectAuthOption}>
            <Select.Option value="basicAuthentication">Basic Authentication</Select.Option>
          </Select>
        </Form.Item>
        <div style={{ marginTop: '20px' }}>
          {currentAuthForm === 'basicAuthentication' && <FormBasicAuth></FormBasicAuth>}
       </div>
        <Form.Item><Button type="primary" htmlType="submit">Submit the Pickup</Button></Form.Item>
      </Form>
      </div>
      <div>
        <Card title="Pickup Creaton Status" style={{ width: 300 }}>
                {loading ? (
                    <Spin />
                ) : (
                    <div>
                        <p>{cardData ? cardData.message : "Pickup creation failed."}</p>
                    </div>
                )}
        </Card>
      </div>
    </>
  );
};

export default SftpPickup;
