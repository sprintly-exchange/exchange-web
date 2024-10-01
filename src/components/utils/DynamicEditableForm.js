import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Select } from 'antd';
import { ApiClient } from './ApiClient';
import { camelCaseToWords } from './commonUtils';

// Utility functions to flatten and unflatten objects
const flattenObject = (obj, prefix = '', res = {}) => {
  for (let key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
};

const unflattenObject = (data) => {
  const result = {};
  for (let i in data) {
    const keys = i.split('.');
    keys.reduce((acc, value, index) => {
      return acc[value] || (acc[value] = isNaN(Number(keys[index + 1]))
        ? (keys.length - 1 === index ? data[i] : {})
        : []);
    }, result);
  }
  return result;
};

const DynamicEditableForm = ({ inputData, apiUrl, httpMethod, objectName, action }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(flattenObject(inputData));
  const [editWindowEnabled, setEditWindowEnabled] = useState(true);

  // Extract hidden fields from the input data
  const hiddenFields = {
    processingId: inputData.processingId,
    organizationId: inputData.organizationId,
    userId: inputData.userId,
    connectionId: inputData.connectionId,
    pickupId: inputData.pickupId,
    deliveryId: inputData.deliveryId,
    id: inputData.id,
  };

  useEffect(() => {
    setData(flattenObject(inputData));
    form.setFieldsValue(flattenObject(inputData));
  }, [inputData, form]);

  const onFinish = (values) => {
    // Merge the hidden fields with form values
    const nestedData = unflattenObject({
      ...values,
      ...hiddenFields, // Add hidden fields to the submission
    });

    console.log('Updated JSON object:', nestedData);
    setData(flattenObject(nestedData));
    new ApiClient().updateData(apiUrl, nestedData, httpMethod);
    setEditWindowEnabled(false);
  };

  const onCancel = () => {
    form.resetFields(); // Reset form fields to initial values
    setEditWindowEnabled(false); // Close the edit window
  };

  return (
    <>
      <div style={{ marginTop: '20px', display: editWindowEnabled ? 'block' : 'none' }}>
        <Row span={24}>
          <Col span={24}>
            <Card title={objectName || 'Select a record to edit.'}>
              <Form form={form} name="dynamic_form" onFinish={onFinish} autoComplete="off">
                {Object.keys(data).map((key) => (
                  key.includes('UiDisplayFalse') 
                    || key === 'processingId'
                    || key === 'organizationId'
                    || key === 'userId'
                    || key === 'connectionId'
                    || key === 'pickupId'
                    || key === 'deliveryId'
                    || key === 'roleId'
                    || key === 'id'
                    || key === 'isDefault'
                    ? null : (  // Hide the fields you don't want to show in the UI
                    <Form.Item
                      key={key}
                      name={key}
                      label={camelCaseToWords(key)}
                      rules={[
                        { required: true, message: `Please input ${key}` },
                        {
                          validator: (_, value) => {
                            if (key.toLowerCase() === 'username' && /\s/.test(value)) {
                              return Promise.reject('Username cannot contain spaces');
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      {Array.isArray(data[key]) ? (
                        <Select>
                          {data[key].map((option, index) => (
                            <Select.Option key={index} value={option}>
                              {option}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') ? (
                        <Input.Password />
                      ) : (
                        <Input disabled={key === 'protocol' 
                          || key === 'authenticationType' 
                          || key === 'activationStatus'
                          || key === 'creationTime'
                          || key === 'registrationDate'
                          || key === 'code'
                          || key === 'lastLoggedInTime'
                        } />
                      )}
                    </Form.Item>
                  )
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {action}
                  </Button>
                  <Button style={{ marginLeft: '10px' }} onClick={onCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DynamicEditableForm;
