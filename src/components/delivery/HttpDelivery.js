// src/LoginForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select ,Card, Spin, message} from 'antd';
import {ConnectionHTTP} from '../../models/ConnectionHTTP.mjs'
import FormBasicAuth from '../iam/FormBasicAuth';
import FormOauth10 from '../iam/FormOauth10';
import FormOauth20 from '../iam/FormOauth20';
import FormJwt from '../iam/FormJwt';
import FormApiKey from  '../iam/FormApiKey';
import NoAuth from '../iam/NoAuth';


const HttpDelivery = () => {
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
      case 'apiKey':
        setCurrentAuthForm('apiKey');
        break;
      case 'oAuth10':
        setCurrentAuthForm('oAuth10');
        break;
      case 'oAuth20':
        setCurrentAuthForm('oAuth20');
        break;
      case 'jwt':
        setCurrentAuthForm('jwt');
        break;
      case 'noAuth':
        setCurrentAuthForm('noAuth');
          break;
      default:

    }
  };


  const onFinish = (values) => {
    console.log('values:', values);
    const  connectionHTTP = new ConnectionHTTP();
    
    Object.assign(connectionHTTP,values);
    sendData(`${process.env.REACT_APP_API_BASE_URL}/api/Delivery`,connectionHTTP);
    console.log('connectionHTTP:', connectionHTTP);
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
      message : `Delivery created with id : ${responseData.id}`
     }
     setCardData(cardData);
     setLoading(false);
     message.info(`A HTTP delivery was created with ID ${responseData.id}.`);
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
      <Form  name ="formHttpDelivery" form={form} layout="horizontal" labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} style={{ maxWidth: 600, }} initialValues={{ remember: true, }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="on">
        <Form.Item label="Connection Name" name="connectionName" rules={[{ required: true, message: 'connectionName' }]}><Input /></Form.Item>
        <Form.Item label="Host" name="host" rules={[{ required: true, message: 'host' }]}><Input /></Form.Item>
        <Form.Item label="Port" name="port" rules={[{ required: true, message: 'port' }]}><Input /></Form.Item>
        <Form.Item label="Retry Interval" name="retryInterval" rules={[{ required: false, message: 'retryInterval' }]}><Input /></Form.Item>
        <Form.Item label="Retry Attemps" name="retryAttemps" rules={[{ required: false, message: 'retryAttemps' }]}><Input /></Form.Item>
        <Form.Item label="Base Path" name="basePath" rules={[{ required: true, message: 'basePath' }]}><Input /></Form.Item>
        <Form.Item label="Api Path" name="apiPath" rules={[{ required: false, message: 'apiPath' }]}><Input /></Form.Item>
        <Form.Item label="Method" name ="method" value="Select HTTP Method" rules={[{ required: true, message: 'method' }]}>
          <Select rules={[{ required: true, message: 'method' }]}>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Content Type" name ="headers.Content-Type" value="Content Type" rules={[{ required: true, message: 'contentType' }]}>
          <Select rules={[{ required: true, message: 'method' }]}>
            <Select.Option value="application/json">application/json</Select.Option>
            <Select.Option value="application/xml">application/xml</Select.Option>
            <Select.Option value="application/octet-stream">application/octet-stream</Select.Option>
            <Select.Option value="text/csv">text/csv</Select.Option>
            <Select.Option value="text/html">text/html</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Accept" name ="headers.Accept" value="Accept" rules={[{ required: true, message: 'Accept' }]}>
          <Select rules={[{ required: true, message: 'method' }]}>
            <Select.Option value="application/json">application/json</Select.Option>
            <Select.Option value="application/xml">application/xml</Select.Option>
            <Select.Option value="application/octet-stream">application/octet-stream</Select.Option>
            <Select.Option value="text/csv">text/csv</Select.Option>
            <Select.Option value="text/html">text/html</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Authentication Type" name ="authenticationType" value="Select authenticationType" rules={[{ required: true, message: 'authenticationType' }]}>
          <Select onChange={selectAuthOption}>
            <Select.Option value="noAuth">No Authentication</Select.Option>
            <Select.Option value="basicAuthentication">Basic Authentication</Select.Option>
            <Select.Option value="apiKey">API Key</Select.Option>
            <Select.Option value="oAuth10">OAuth 1.0</Select.Option>
            <Select.Option value="oAuth20">OAuth 2.0</Select.Option>
            <Select.Option value="jwt">JWT</Select.Option> 
          </Select>
        </Form.Item>
        <div style={{ marginTop: '20px' }}>
          {currentAuthForm === 'basicAuthentication' && <FormBasicAuth></FormBasicAuth>}
          {currentAuthForm === 'apiKey' && <FormApiKey></FormApiKey>}
          {currentAuthForm === 'oAuth10' && <FormOauth10></FormOauth10>}
          {currentAuthForm === 'oAuth20' && <FormOauth20></FormOauth20>}
          {currentAuthForm === 'jwt' && <FormJwt></FormJwt>}
          {currentAuthForm === 'noAuth' && <NoAuth></NoAuth>}
       </div>
        <Form.Item><Button type="primary" htmlType="submit">Submit the Delivery</Button></Form.Item>
      </Form>
      </div>
      <div>
        <Card title="Delivery Creaton Status" style={{ width: 300 }}>
                {loading ? (
                    <Spin />
                ) : (
                    <div>
                        <p>{cardData ? cardData.message : "Delivery creation failed."}</p>
                    </div>
                )}
        </Card>
      </div>
    </>
  );
};

export default HttpDelivery;
