import React, { useState } from 'react';
import { Select} from 'antd';
import CurrentPickupsTable from './CurrentPickupsTable';
import { Typography } from 'antd';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import configManagerFE from '../configuration/configManager';
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
  fsTemplate,
  mqttTemplate,
} from '../protooclTemplates/protocolTemplates.js';

const { Title } = Typography;


const Pickup = () => {
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
      case 'mqttTemplate':
        setCurrentForm('mqttTemplate');
        break;    
      default:
    }
  };



  return (

    
    <div>
      <Typography.Title level={3}>Pickup Management </Typography.Title>
      <div>
      <Select style={{ width: 300 }}  listHeight={500} onChange={makeFormVisible} value="Add a pickup"
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
              {
                value: 'mqttTemplate',
                label: 'MQTT Connection',
              },
            ]}
          >
        </Select>
      </div>
      <div style={{ marginTop: '20px' }}>
         {currentForm === 'fsTemplate' && (
            <DynamicEditableForm
              inputData={fsTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'File System'}
              action={'Create'}
            />
          )}
          {currentForm === 'noAuthTemplate' && (
            <DynamicEditableForm
              inputData={noAuthTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'HTTP without Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'basicAuthTemplate' && (
            <DynamicEditableForm
              inputData={basicAuthTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'HTTP Basic Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'oAuth2Template' && (
            <DynamicEditableForm
              inputData={oAuth2Template}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'OAuth 2.0'}
              action={'Create'}
            />
          )}
          {currentForm === 'jwtTemplate' && (
            <DynamicEditableForm
              inputData={jwtTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'JWT Authentication'}
              action={'Create'}
            />
          )}
          {currentForm === 'kafkaTemplate' && (
            <DynamicEditableForm
              inputData={kafkaTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'Kafka'}
              action={'Create'}
            />
          )}
          {currentForm === 'openIDConnectTemplate' && (
            <DynamicEditableForm
              inputData={openIDConnectTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'OpenID Connect'}
              action={'Create'}
            />
          )}
          {currentForm === 'ftpTemplate' && (
            <DynamicEditableForm
              inputData={ftpTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'FTP'}
              action={'Create'}
            />
          )}
          {currentForm === 'sftpTemplate' && (
            <DynamicEditableForm
              inputData={sftpTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'SFTP'}
              action={'Create'}
            />
          )}
          {currentForm === 'websocketTemplate' && (
            <DynamicEditableForm
              inputData={websocketTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'WebSocket'}
              action={'Create'}
            />
          )}
          {currentForm === 'mqttTemplate' && (
            <DynamicEditableForm
              inputData={mqttTemplate}
              apiUrl={`/api/pickup/`}
              httpMethod={'POST'}
              objectName={'MQTT'}
              action={'Create'}
            />
          )}
        </div>
      <div>
      <CurrentPickupsTable></CurrentPickupsTable>
      </div>
    </div>
  );
};

export default Pickup;