import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import CurrentOrganizationsTable from './CurrentOrganizationsTable';
import CurrentUsersTable from './CurrentUsersTable';
import OrganizationCreationForm from './OrganizationCreationForm';
import { Form, Input, Button, Select, message, Divider , Typography} from 'antd';
import { messageWarning } from '../utils/commonUtils';
const { Text, Title } = Typography;

const { Option } = Select;

function OrganizationManagement() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [triggerOrgfetch,setTriggerOrgfetch] = useState(false);
 

  return (
    <div>
      <Title level={3}>Organization Management</Title>
          {/*<OrganizationCreationForm></OrganizationCreationForm>*/}
          <CurrentOrganizationsTable triggerOrgfetch = {triggerOrgfetch} setTriggerOrgfetch={setTriggerOrgfetch} />

    </div>
  );
}

export default OrganizationManagement;
