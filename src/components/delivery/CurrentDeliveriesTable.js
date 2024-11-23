import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography } from 'antd';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CurrentDeliveriesTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dynamicRecordToEdit, setdynamicRecordToEdit] = useState([]);

    const handleDelete = record => {
        axiosInstance.delete(`/api/delivery/${record.id}`)
            .then(response => {
                setData(prevDataSource => prevDataSource.filter(item => item.id !== record.id));
                message.info(`Delivery record deleted with ID ${record.id}.`);
            })
            .catch(error => {
                message.error(error.response.data.message);
            });
    };

    const editRecord = record => {
        axiosInstance.get(`/api/delivery/${record.id}`)
            .then(response => {
                setdynamicRecordToEdit(response.data);
            })
            .catch(error => {
                message.error(`There was an error getting record with ID ${record.id}.`);
            });
    };

    const handleExport = record => {
        axiosInstance.get(`/api/delivery/${record.id}`, {
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
            title: 'Delivery Host',
            dataIndex: 'host',
            render: (text, record) => (
                <span>{record.host || record.brokers}</span>
            ),
        },
        {
            title: 'Delivery protocol',
            dataIndex: 'protocol',
            key: 'protocol',
        },
        {
            title: 'Delivery port',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: 'Path',
            dataIndex: 'basePath',
            render: (text, record) => (
                <span>{record.basePath || record.remotePath || record.path}</span>
            ),
        },
        {
            title: 'Used By Flow',
            dataIndex: 'isUsed',
            render: (text, record) => (
                <span>{ record.isUsed && record.flowName ? record.flowName : 'Not in use'}</span> //use base path(HTTP) or remote path(FTP) or path(File system)
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
                    {/*<DownloadOutlined
                        style={{ color: 'green', cursor: 'pointer' }}
                        onClick={() => handleExport(record)}
                    /> */}
                </>
            ),
        },
    ];

    useEffect(() => {
        axiosInstance.get(`/api/delivery`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                message.error('There was an error fetching the data!');
                setLoading(false);
            });
    }, [dynamicRecordToEdit]);

    return (
        <>
            <div>
                <Title level={4}>Current Deliveries</Title>
                <Spin spinning={loading}>
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                    />
                </Spin>
            </div>
            <div>
                <DynamicEditableForm
                    inputData={dynamicRecordToEdit}
                    apiUrl={`/api/delivery/`}
                    httpMethod={'PUT'}
                    objectName={dynamicRecordToEdit.connectionName}
                    action={'Update'}
                />
            </div>
        </>
    );
};

export default CurrentDeliveriesTable;
