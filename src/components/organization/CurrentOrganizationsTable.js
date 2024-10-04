import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Row, Col, Card } from 'antd';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import DynamicEditableForm from '../utils/DynamicEditableForm';
import { handleErrorResponse } from '../utils/commonUtils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


const { Title } = Typography;

const CurrentOrganizationsTable = (setTriggerOrgfetch,triggerOrgfetch) => {
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [dynamicRecordToEdit, setDynamicRecordToEdit] = useState({});

    const fetchOrganizations = async () => {
        axiosInstance.get(`/api/organizations`)
        .then((response) => {
            setOrganizations(response.data);
            setTriggerOrgfetch(false);
        })
        .catch (error => {
            handleErrorResponse(error);
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchOrganizations();
    }, [dynamicRecordToEdit,triggerOrgfetch]);

    const handleDelete = async (record) => {
        try {
            await axiosInstance.delete(`/api/organizations/id/${record.id}`)
            .then((response) => {
                setOrganizations(prevDataSource => prevDataSource.filter(item => item.id !== record.id));
                message.info(response.data.message);
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
            
        } catch (error) {
            message.error(`There was an error deleting the record with ID ${record.id}.`);
        }
    };

    const editRecord = async (record) => {
        console.log(record);
        await axiosInstance.get(`/api/organizations/id/${record.id}`)
        .then((response) => {
            setDynamicRecordToEdit(response.data);
        })
        .catch((error) => {
            handleErrorResponse(error);
        });
     
    };

    const columns = [
        {
            title: 'Organization Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Web',
            dataIndex: 'web',
            key: 'web',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <DeleteOutlined
            style={{ color: 'red', cursor: 'pointer', marginRight: 16 }}
            onClick={() => handleDelete(record)}
          />
                    <EditOutlined
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => editRecord(record)}
          />
                </>
            )
        }
    ];

    return (
        <>
            <div>
                <Title level={4}>Current Organizations</Title>
                <Spin spinning={loading}>
                    <Table
                        dataSource={Array.isArray(organizations) ? organizations : []}
                        columns={columns}
                        rowKey="id"
                    />
                </Spin>
            </div>
            <div>
                <DynamicEditableForm
                        inputData={dynamicRecordToEdit}
                        apiUrl={`/api/organizations/id/${dynamicRecordToEdit.id}`}
                        httpMethod='PUT'
                        objectName={ `Editing organization :  ${dynamicRecordToEdit.name||'Not Yet Selected'}` }
                        action='Update'
                />
            </div>
        </>
    );
};

export default CurrentOrganizationsTable;
