// src/LoginForm.js
import React, { useState } from 'react';
import { Form, Input, Button,Card, Spin, message} from 'antd';
import {ConnectionFS} from '../../models/ConnectionFS';




const FsDelivery = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);

  const onFinish = (values) => {
    console.log('values:', values);
    const  connectionFS = new ConnectionFS();
    
    Object.assign(connectionFS,values);
    console.log('connectionFC:', connectionFS);
    sendData(`${process.env.REACT_APP_API_BASE_URL}/api/delivery`,connectionFS);
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
     message.info(`A FS delivery was created with ID ${responseData.id}.`);
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
        <Form.Item label="Path" name="path" rules={[{ required: true, message: 'path' }]}><Input /></Form.Item>
        <Form.Item label="Retry Interval" name="retryInterval" rules={[{ required: false, message: 'retryInterval' }]}><Input /></Form.Item>
        <Form.Item label="Retry Attemps" name="retryAttemps" rules={[{ required: false, message: 'retryAttemps' }]}><Input /></Form.Item>
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

export default FsDelivery;
