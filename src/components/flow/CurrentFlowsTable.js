import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Modal, Row, Col} from 'antd';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import axiosInstance from '../utils/axiosConfig';
import { render } from 'less';
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CurrentFlowsTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [fetchData,setFetchData] = useState(false);
    const [dynamicRecordToEdit,setdynamicRecordToEdit] = useState([]);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this flow?',
            content: `Flow : ${record.flowName}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDelete(record);
            },
        });
    };

    const handleDelete = (record) => {
        console.log('record', record.id);
        axiosInstance.delete(`${configManagerFE.getConfig('apiBaseUrl')}/api/flow/${record.id}`)
            .then(response => {
                console.log('Delete status', response.status);
                setData(prevDataSource => prevDataSource.filter(item => item.id !== record.id));
                message.info(`Flow details deleted with ID ${record.id}.`);
            })
            .catch(error => {
                message.error(error.response.data.message);
            });
    };

    const editRecord = record => {
        console.log('record id receivd for editing : ',record.id);
        axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/flow/${record.id}`)
            .then(response => {
               console.log('Flow received for editing',response.data);
               setdynamicRecordToEdit(response.data); 
            })
            .catch(error => {
                message.error(`There was an error getting record with ID ${record.id}.`);
               
            });
        
    };

    const handleActivateDeactivate = (record) => {
        const updatedStatus = !record.activationStatus; // Toggle the activation status
        axiosInstance.put(`${configManagerFE.getConfig('apiBaseUrl')}/api/flow/activation/${record.id}`, { active: updatedStatus })
            .then(response => {
                setData(prevDataSource => prevDataSource.map(item => 
                    item.id === record.id ? { ...item, active: updatedStatus } : item
                ));
                message.info(`Flow ID ${record.flowName} is now ${updatedStatus ? 'active' : 'inactive'}.`);
                setFetchData(true);
            })
            .catch(error => {
                message.error(`Error updating status: ${error.response.data.message}`);
            });
    };

    const columns = [
        {
            title: 'Flow Name',
            dataIndex: 'flowName',
            key: 'flowName',
        },
        {
            title: 'Flow Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'Pickup Id',
            dataIndex: 'pickupId',
            key: 'pickupId',
            hidden: true,
        },
        {
            title: 'Delivery Id',
            dataIndex: 'deliveryId',
            key: 'deliveryId',
            hidden: true,
        },
        {
            title: 'Pickup Name',
            dataIndex: 'pickupName',
            key: 'pickupName',
        },
        {
            title: 'Delivery Name',
            dataIndex: 'deliveryName',
            key: 'deliveryName',
        },
        {
            title: 'Activation Status',
            dataIndex: 'activationStatus',
            render: (text,record) => (record.activationStatus ? 'Active' : 'Deactive'),
        },
        {
            title: 'Organization Name',
            dataIndex: 'organizationName',
            key: 'organizationName',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <DeleteOutlined
            style={{ color: 'red', cursor: 'pointer', marginRight: 16 }}
            onClick={() => showDeleteConfirm(record)}
          />
          {record.activationStatus ? (
            <CheckCircleOutlined
              style={{ color: 'green', cursor: 'pointer', marginRight: 16 }}
              onClick={() => handleActivateDeactivate(record)}
            />
          ) : (
            <StopOutlined
              style={{ color: 'orange', cursor: 'pointer', marginRight: 16 }}
              onClick={() => handleActivateDeactivate(record)}
            />
          )}
          <EditOutlined
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => editRecord(record)}
          />
        
                </>
            ),
        }
        // Add more columns as needed
    ];

    useEffect(() => {
        axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/flow`)
            .then(response => {
                setData(response.data);
                setLoading(false);
                setFetchData(false);
            })
            .catch(error => {
                message.error('There was an error fetching the data!');
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    }, [fetchData]);

    return (
        <>         
         <div>
            <Title level={4}>Current flows</Title>
            <Spin spinning={loading}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id" // Replace with the unique key in your data
                />
            </Spin>
            </div>
            <div>
                <DynamicEditableForm inputData={dynamicRecordToEdit} apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/flow/`} httpMethod = {'PUT'}  objectName={dynamicRecordToEdit.flowName} action={'Update'}/>
            </div>
        </>

        
    );
};

export default CurrentFlowsTable;