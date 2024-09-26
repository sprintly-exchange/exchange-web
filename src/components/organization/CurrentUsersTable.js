import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Row, Col, Card } from 'antd';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import { handleErrorResponse } from '../utils/commonUtils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CurrentUsersTable = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [dynamicRecordToEdit, setDynamicRecordToEdit] = useState({});

    const fetchUsers = async () => {
        await axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/users`)
        .then((response)=> {
            setUsers(Array.isArray(response.data) ? response.data : [response.data]); 
            setLoading(false);
        })
        .catch((error) => {
            handleErrorResponse(error); 
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [dynamicRecordToEdit]);

    const handleDelete = async (record) => {
        try {
            await axiosInstance.delete(`${configManagerFE.getConfig('apiBaseUrl')}/api/users/id/${record.id}`)
            .then((response) => {
                setUsers(prevDataSource => prevDataSource.filter(item => item.id !== record.id));
                message.success(response.data.message);
            })
            .catch((error) => {
                handleErrorResponse(error); 
            });
            
        } catch (error) {
            handleErrorResponse(error); 
        }
    };

    const editRecord = async (record) => {
        try {
            const response = await axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/users/id/${record.id}`);
            setDynamicRecordToEdit(response.data);
        } catch (error) {
            handleErrorResponse(error); 
        }
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                     <DeleteOutlined
            style={{ color: 'red', cursor: 'pointer', fontSize: '16px', marginRight: 16 }}
            onClick={() => handleDelete(record)}
          />
                    <EditOutlined
            style={{ color: 'blue', cursor: 'pointer', fontSize: '16px' }}
            onClick={() => editRecord(record)}
          />
                </>
            )
        }
    ];

    return (
        <>
            <div>
            <Title level={4}>Current Users</Title>
                <Spin spinning={loading}>
                    <Table
                        dataSource={Array.isArray(users) ? users : []}
                        columns={columns}
                        rowKey="id"
                    />
                </Spin>
            </div>
            <div>
                <DynamicEditableForm
                    inputData={dynamicRecordToEdit}
                    apiUrl={`${configManagerFE.getConfig('apiBaseUrl')}/api/users/edit-user`}
                    httpMethod='PUT'
                    objectName={ `Editing User :  ${dynamicRecordToEdit.username||'Not Yet Selected'}` }
                    action='Update'
                />
            </div>
        </>
    );
};

export default CurrentUsersTable;
