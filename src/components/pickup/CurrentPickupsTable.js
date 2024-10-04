import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Card, Row, Col } from 'antd';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import axiosInstance from '../utils/axiosConfig';
import { DeleteOutlined, EditOutlined,DownloadOutlined } from '@ant-design/icons';


const { Title } = Typography;

const CurrentPickupsTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dynamicRecordToEdit,setdynamicRecordToEdit] = useState([]);
    
    const handleDelete = record => {
        console.log('record',record.id);
        axiosInstance.delete(`/api/pickup/${record.id}`)
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
        axiosInstance.get(`/api/pickup/${record.id}`)
            .then(response => {
               console.log('Pickup received for editing',response.data);
               setdynamicRecordToEdit(response.data); 
            })
            .catch(error => {
                message.error(`There was an error getting record with ID ${record.id}.`);
               
            });
        
    };

    const handleExport = record => {
        axiosInstance.get(`/api/pickup/${record.id}`, {
            responseType: 'text', // This tells axios to expect a binary file response (like a CSV, PDF, etc.)
        })
            .then(response => {
                // Create a link element to download the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                // Set the file name dynamically based on the record (e.g., using `connectionName`)
                link.setAttribute('download', `${record.connectionName}_export.json`);
                
                // Append to the body, trigger the download and then remove the link element
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                message.success(`Export successful for record with ID ${record.id}`);
            })
            .catch(error => {
                message.error(`Failed to export record with ID ${record.id}: ${error.message}`);
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
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <>
                    <DeleteOutlined
                        style={{ color: 'red', cursor: 'pointer', marginRight: 16 }}
                        onClick={() => handleDelete(record)}
                    />
                    <EditOutlined
                        style={{ color: 'blue', cursor: 'pointer', marginRight: 16 }}
                        onClick={() => editRecord(record)}
                    />
                    <DownloadOutlined
                        style={{ color: 'green', cursor: 'pointer' }}
                        onClick={() => handleExport(record)}
                    /> 
                </>
            ),
        },
        // Add more columns as needed
    ];

    useEffect(() => {
        // Replace 'your-api-url' with the actual API endpoint
        axiosInstance.get(`/api/pickup`)
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
                <DynamicEditableForm inputData={dynamicRecordToEdit} apiUrl={`/api/pickup/`} httpMethod = {'PUT'}  objectName={dynamicRecordToEdit.connectionName} action={'Update'} />
          </div>
       </div>
    </> 
       
    );
};

export default CurrentPickupsTable;
