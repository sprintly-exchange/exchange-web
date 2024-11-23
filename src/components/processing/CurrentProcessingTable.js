import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Typography, Button, Card, Row, Col } from 'antd';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from '../configuration/configManager';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import CodeEditor from '../codeEditor/codeEditor'; // Import the CodeEditor

const { Title } = Typography;

const CurrentProcessingTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dynamicRecordToEdit, setDynamicRecordToEdit] = useState(null); // Changed to null initially
    const [editedCode, setEditedCode] = useState(''); // State to store code from CodeEditor

    const handleDelete = (record) => {
        axiosInstance
            .delete(`/api/processing/${record.id}`)
            .then((response) => {
                setData((prevDataSource) => prevDataSource.filter((item) => item.id !== record.id));
                message.info(`Processing details deleted with ID ${record.id}`);
            })
            .catch((error) => {
                message.error(error.response.data.message);
            });
    };

    const editRecord = (record) => {
        axiosInstance
            .get(`/api/processing/${record.id}`)
            .then((response) => {
                setDynamicRecordToEdit(response.data);
                try {
                    const decodedCode = atob(response.data.code); // Decode base64 code
                    setEditedCode(decodedCode); // Update editedCode state with API response
                } catch (error) {
                    message.error('Error decoding base64 string.');
                    console.error('Decoding error:', error);
                }
            })
            .catch((error) => {
                message.error(`There was an error getting record with ID ${record.id}.`);
            });
    };

    const handleCodeChange = (newCode) => {
        setEditedCode(newCode); // Update the state with the new code from the CodeEditor
    };

    const handleSubmit = () => {
        if (!dynamicRecordToEdit) return;

        try {
            const encodedCode = btoa(editedCode); // Encode the code back to base64

            const updatedRecord = {
                ...dynamicRecordToEdit,
                code: encodedCode, // Use the base64 encoded code
            };

            axiosInstance
                .put(`/api/processing`, updatedRecord)
                .then((response) => {
                    message.success(`Processing details updated with ID ${response.data.id}`);
                    setDynamicRecordToEdit(null); // Close the editing card
                    setEditedCode(''); // Reset code editor state
                    setLoading(true); // Reload table data
                    fetchProcessingData(); // Fetch updated data
                })
                .catch((error) => {
                    message.error(`There was an error updating record with ID ${dynamicRecordToEdit.id}.`);
                });
        } catch (error) {
            message.error('Error encoding the code for submission.');
            console.error('Encoding error:', error);
        }
    };

    const fetchProcessingData = () => {
        axiosInstance
            .get(`/api/processing`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                message.error('There was an error fetching the data!');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProcessingData();
    }, []);

    const handleExport = record => {
        axiosInstance.get(`/api/processing/${record.id}`, {
            responseType: 'text', // This tells axios to expect a binary file response (like a CSV, PDF, etc.)
        })
            .then(response => {
                // Create a link element to download the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                // Set the file name dynamically based on the record (e.g., using `connectionName`)
                link.setAttribute('download', `${record.processingName}_export.json`);
                
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
            title: 'Processing Name',
            dataIndex: 'processingName',
            key: 'processingName',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
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

    return (
        <>
            <div>
                <Title level={4}>Current Processings</Title>
                <Spin spinning={loading}>
                    <Table dataSource={data} columns={columns} rowKey="id" />
                </Spin>
            </div>
            <div>
                {dynamicRecordToEdit && (
                    <Card title={dynamicRecordToEdit.processingName ? "Editing " + dynamicRecordToEdit.processingName : "Edit Processing"}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <CodeEditor code={editedCode} onChange={handleCodeChange} /> {/* CodeEditor with initial code and onChange handler */}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={24}>
                                <Button type="primary" onClick={handleSubmit}>
                                    Submit Changes
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                )}
            </div>
        </>
    );
};

export default CurrentProcessingTable;
