import React, { useState } from 'react';
import { Select, Space} from 'antd';
import CurrentDeliveriesTable from './CurrentDeliveriesTable';
import { Typography } from 'antd';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import {
  noAuthTemplate,
  basicAuthTemplate,
  oAuth2Template,
  jwtTemplate,
  kafkaTemplate,
  openIDConnectTemplate,
  ftpTemplate,
  sftpTemplate,
  websocketTemplate,
  partnerFinanceGroupSE,
  fsTemplate,
} from '../protooclTemplates/protocolTemplates.js';
import configManagerFE from '../configuration/configManager';

const { Title } = Typography;
const { Option } = Select;


const Delivery = () => {
  const [currentForm, setCurrentForm] = useState('');

  const makeFormVisible = (event) => {
    console.log(event);
    switch(event){
      case 'fsTemplate':
        setCurrentForm('fsTemplate');
        break;
      case 'noAuthTemplate':
        setCurrentForm('noAuthTemplate');
        break;
      case 'basicAuthTemplate':
        setCurrentForm('basicAuthTemplate');
        break;
      case 'oAuth2Template':
        setCurrentForm('oAuth2Template');
        break;
      case 'jwtTemplate':
        setCurrentForm('jwtTemplate');
        break;      
      case 'kafkaTemplate':
        setCurrentForm('kafkaTemplate');
        break;      
      case 'openIDConnectTemplate':
        setCurrentForm('openIDConnectTemplate');
        break;      
      case 'ftpTemplate':
        setCurrentForm('ftpTemplate');
        break;      
      case 'sftpTemplate':
        setCurrentForm('sftpTemplate');
        break;      
      case 'websocketTemplate':
        setCurrentForm('websocketTemplate');
        break;   
      case 'partnerFinanceGroupSE':
        setCurrentForm('partnerFinanceGroupSE');
        break;     
      default:
    }
  };
  
  // Custom function to render options with icons
  const renderOption = (option) => (
    <Option key={option.value} value={option.value}>
      <img src={`/images/${option.image}`} alt={option.label} style={{ width: 'auto', height: 24, marginRight: 8, imageRendering: 'pixelated' }} />
      {option.label}
    </Option>
  );


  return (
    <div>
          <Typography.Title level={3}>Delivery Management </Typography.Title>
          <Space>
      <div>
      <Select style={{ width: 300 }} listHeight={500} onChange={makeFormVisible} value="Add a delivery"
            options={[
              {
                value: 'noAuthTemplate',
                label: 'HTTP without Authentication',
              },
              {
                value: 'basicAuthTemplate',
                label: 'HTTP Basic Authentication',
              },
              {
                value: 'ftpTemplate',
                label: 'FTP Connection',
              },
              {
                value: 'fsTemplate',
                label: 'File System',
              },
              {
                value: 'kafkaTemplate',
                label: 'KAFKA Connection',
              },
            ]}
          >
        </Select>
      </div>
      </Space>
        <div style={{ marginTop: '20px' }}>
        {currentForm === 'fsTemplate' && (
            <DynamicEditableForm
              inputData={fsTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'File System'}
              action={'Create'}
            />
          )}
          {currentForm === 'noAuthTemplate' && (
            <DynamicEditableForm
              inputData={noAuthTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'HTTP Without Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'basicAuthTemplate' && (
            <DynamicEditableForm
              inputData={basicAuthTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'HTTP Basic Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'oAuth2Template' && (
            <DynamicEditableForm
              inputData={oAuth2Template}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'OAuth 2.0'}
              action={'Create'}
            />
          )}
          {currentForm === 'jwtTemplate' && (
            <DynamicEditableForm
              inputData={jwtTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'JWT Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'kafkaTemplate' && (
            <DynamicEditableForm
              inputData={kafkaTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'Kafka'}
              action={'Create'}
            />
          )}
          {currentForm === 'openIDConnectTemplate' && (
            <DynamicEditableForm
              inputData={openIDConnectTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'OpenID Connect'}
              action={'Create'}
            />
          )}
          {currentForm === 'ftpTemplate' && (
            <DynamicEditableForm
              inputData={ftpTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'FTP'}
              action={'Create'}
            />
          )}
          {currentForm === 'sftpRecordType' && (
            <DynamicEditableForm
              inputData={sftpTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'SFTP'}
              action={'Create'}
            />
          )}
          {currentForm === websocketTemplate && (
            <DynamicEditableForm
              inputData={websocketTemplate}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'WebSocket'}
              action={'Create'}
            />
          )}
          {currentForm === 'partnerFinanceGroupSE' && (
            <DynamicEditableForm
              inputData={partnerFinanceGroupSE}
              apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/delivery/`}
              httpMethod={'POST'}
              objectName={'Connect to Finance Group(Sweden)'}
              action={'Create'}
            />
          )}
        </div>
      <div>
      <CurrentDeliveriesTable></CurrentDeliveriesTable>
      </div>
    </div>
  );
};

export default Delivery;