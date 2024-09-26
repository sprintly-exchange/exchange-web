import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Card, Row, Col } from 'antd';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import axiosInstance from '../utils/axiosConfig';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


const { Title } = Typography;

const CurrentPickupsTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dynamicRecordToEdit,setdynamicRecordToEdit] = useState([]);
    
    const handleDelete = record => {
        console.log('record',record.id);
        axiosInstance.delete(`${configManagerFE.getConfig('apiBaseUrl')}/api/pickup/${record.id}`)
            .then(response => {
               console.log('Delete status',response.status);
               setData(prevDataSource => prevDataSource.filter(item => item.id !== record.id));
               message.info(`Pickup details deleted with ID ${record.id }`);
            })
            .catch(error => {
                message.error(error.response.data.message);
               
            });
        
    };

    const editRecord = record => {
        console.log('record id receivd for editing : ',record.id);
        axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/pickup/${record.id}`)
            .then(response => {
               console.log('Pickup received for editing',response.data);
               setdynamicRecordToEdit(response.data); 
            })
            .catch(error => {
                message.error(`There was an error getting record with ID ${record.id}.`);
               
            });
        
    };

    const columns = [
        {
            title: 'Connection Name',
            dataIndex: 'connectionName',
            key: 'connectionName',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'Pickup protocol',
            dataIndex: 'protocol',
            key: 'protocol',
        },
        {
            title: 'Pickup Host',
            dataIndex: 'host',
            render: (text, record) => (
                <span>{record.host || record.brokers}</span> //use base path(HTTP) or remote path(FTP) or path(File system)
            ),
        },
        {
            title: 'Pickup port',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: 'Path',
            dataIndex: 'basePath',
            render: (text, record) => (
                <span>{record.basePath || record.remotePath || record.path }</span> //use base path(HTTP) or remote path(FTP) or path(File system)
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <DeleteOutlined
                style={{ color: 'red', cursor: 'pointer', marginRight: 16 }}
                onClick={() => handleDelete(record)}
              />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <EditOutlined
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => editRecord(record)}
              />
            ),
        },
        // Add more columns as needed
    ];

    useEffect(() => {
        // Replace 'your-api-url' with the actual API endpoint
        axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/pickup`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                message.error('There was an error fetching the data!');
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    }, [dynamicRecordToEdit]);

    return (
    <>
       <div>
         <Title level={4}>Current Pickups</Title>
            <Spin spinning={loading}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id" // Replace with the unique key in your data
                />
            </Spin>
       </div>
       <div>
          <div>
                <DynamicEditableForm inputData={dynamicRecordToEdit} apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/pickup/`} httpMethod = {'PUT'}  objectName={dynamicRecordToEdit.connectionName} action={'Update'} />
          </div>
       </div>
    </> 
       
    );
};

export default CurrentPickupsTable;
