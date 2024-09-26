import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Col, Row } from 'antd';
import CurrentFlowsTable from './CurrentFlowsTable';
import DynamicSelect from './DynamicSelect';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

const { Title } = Typography;

const Flows = () => {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [selectedProcessing, setSelectedProcessing] = useState(null); 
  const [flowName, setFlowName] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const _DELIVERY = 'DELIVERY';
  const _PICKUP = 'PICKUP';
  const _PROCESSING = 'PROCESSING'; 

  const flow = {};

  const handleChildDataChange = (data) => {
    if (data[0] === _PICKUP) {
      flow.pickupId = data[1];
      setSelectedPickup(data[2]);
    } else if (data[0] === _DELIVERY) {
      flow.deliveryId = data[1];
      setSelectedDelivery(data[2]);
    } else if (data[0] === _PROCESSING) {
      flow.processingId = data[1];
      setSelectedProcessing(data[2]);
    } else {
      console.error('Error setting pickup, delivery, or processing id to flow.');
    }
  };

  useEffect(() => {
    const processingPart = selectedProcessing ? `-With-${selectedProcessing}` : '';
    const newPlaceholder = `Flow-From-${selectedPickup || 'Pickup'}-To-${selectedDelivery || 'Delivery'}${processingPart}`;
    setPlaceholder(newPlaceholder);

    if (!flowName) {
      setFlowName(newPlaceholder);
    }
  }, [selectedPickup, selectedDelivery, selectedProcessing]);

  const submitFlow = (formAtt) => {
    if (!selectedPickup) {
      message.error('Please select a Pickup location.');
      return;
    }

    if (!selectedDelivery) {
      message.error('Please select a Delivery location.');
      return;
    }

    flow.flowName = formAtt.flowName || placeholder; 

    if (selectedProcessing) {
      flow.processingId = flow.processingId; 
    } else {
      delete flow.processingId; 
    }

    console.log('Submitting flow with name:', flow.flowName);
    sendData(`${configManagerFE.getConfig('apiBaseUrl')}/api/flow`, flow);
  };

  async function sendData(url, data) {
    try {
      const response = await axiosInstance.post(url, data);
      const responseData = response.data;

      const cardData = {
        message: `Flow created with id: ${responseData.id}`,
      };
      setCardData(cardData);
      setLoading(false);
      message.info(`A flow was created with ID ${responseData.id}.`);
    } catch (error) {
      console.error('Error sending data:', error);

      const errorMessage = error.response?.data?.message
        ? error.response.data.message
        : 'An error occurred while sending data.';

      const cardData = {
        message: errorMessage,
      };
      setCardData(cardData);
      setLoading(false);
      message.error(errorMessage);
    }
  }

  return (
    <div>
      <Title level={3}>Flow Management</Title>
      <div>
        <Form
          name="formFlow"
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: '100%' }}
          initialValues={{ flowName }}
          onFinish={submitFlow}
          autoComplete="on"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Flow Name" name="flowName">
                <Input
                  allowClear
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  placeholder={placeholder}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <DynamicSelect
                onDataChange={handleChildDataChange}
                componentId={_PICKUP}
                fetchUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/pickup`}
                selectTypeText={'Select Pickup'}
              />
            </Col>
            <Col span={8}>
              <DynamicSelect
                onDataChange={handleChildDataChange}
                componentId={_DELIVERY}
                fetchUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery`}
                selectTypeText={'Select Delivery'}
              />
            </Col>
            <Col span={8}>
              <DynamicSelect
                onDataChange={handleChildDataChange}
                componentId={_PROCESSING}
                fetchUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/processing`}
                selectTypeText={'Select Processing (Optional)'}
              />
            </Col>
          </Row>

          <Button type="primary" htmlType="submit">
            Create a Flow
          </Button>
        </Form>
      </div>

      <div>
        <CurrentFlowsTable />
      </div>
    </div>
  );
};

export default Flows;
