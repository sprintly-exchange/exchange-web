import React from 'react'
import { Form, Input, Button, message} from 'antd';
import { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import { messageWarning } from '../utils/commonUtils';

function OrganizationCreationForm() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [triggerOrgfetch,setTriggerOrgfetch] = useState(false);
 
  async function addOrganization(name, address, email, web, phone) {
    axiosInstance.post(`${configManagerFE.getConfig('apiBaseUrl')}/api/organizations/register-organization`, { name, address, email, web, phone })
    .then((response) => {
      //fetchOrganizations();
      message.success(response.data.message);
      setTriggerOrgfetch(true);
    }).catch((error) =>  {
      messageWarning(error);
    });
  }

  const handleOrganizationSubmit = (values) => {
    addOrganization(values.name, values.address, values.email, values.web, values.phone);
  };
  return (
    <div>
      <Form onFinish={handleOrganizationSubmit}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the organization name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please input the address!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Organization
              </Button>
            </Form.Item>
          </Form>
    </div>
  )
}

export default OrganizationCreationForm
