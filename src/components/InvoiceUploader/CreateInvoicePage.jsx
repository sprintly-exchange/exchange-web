import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Form, Row, Col, Card, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const CreateInvoicePage = () => {
    const [invoiceLines, setInvoiceLines] = useState([
        { key: 1, quantity: '', itemName: '', unitPrice: '', currencyID: 'USD', amount: '' },
    ]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [form] = Form.useForm();

    useEffect(() => {
        const total = invoiceLines.reduce((sum, line) => sum + parseFloat(line.amount || 0), 0);
        setTotalAmount(total.toFixed(2));
    }, [invoiceLines]);

    const handleLineChange = (key, field, value) => {
        const updatedLines = invoiceLines.map((line) => {
            if (line.key === key) {
                const updatedLine = { ...line, [field]: value };

                if (field === 'quantity' || field === 'unitPrice') {
                    const quantity = parseFloat(updatedLine.quantity) || 0;
                    const unitPrice = parseFloat(updatedLine.unitPrice) || 0;
                    updatedLine.amount = (quantity * unitPrice).toFixed(2);
                }

                return updatedLine;
            }
            return line;
        });

        setInvoiceLines(updatedLines);
    };

    const addInvoiceLine = () => {
        const newLine = {
            key: invoiceLines.length + 1,
            quantity: '',
            itemName: '',
            unitPrice: '',
            currencyID: 'USD',
            amount: '',
        };
        setInvoiceLines([...invoiceLines, newLine]);
    };

    const removeInvoiceLine = (key) => {
        setInvoiceLines(invoiceLines.filter((line) => line.key !== key));
    };

    const handleSubmit = async () => {
        try {
            const invoiceData = form.getFieldsValue();
            invoiceData.invoiceLines = invoiceLines;
    
            const body = {
                id: invoiceData.id,
                date: invoiceData.date,
                senderName: invoiceData.senderName,
                recipientName: invoiceData.recipientName,
                invoiceLines: invoiceLines.map((line, index) => ({
                    id: index + 1,
                    quantity: line.quantity,
                    unitCode: 'EA',
                    amount: line.amount,
                    currencyID: line.currencyID,
                    itemName: line.itemName,
                    unitPrice: line.unitPrice,
                })),
            };
    
            const response = await axios.post('/api/invoice/json', body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                console.log('Invoice created successfully:', response.data);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };
    

    const columns = [
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: (_, record) => (
                <Input
                    value={record.quantity}
                    type="number"
                    onChange={(e) => handleLineChange(record.key, 'quantity', e.target.value)}
                />
            ),
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            render: (_, record) => (
                <Input
                    value={record.itemName}
                    onChange={(e) => handleLineChange(record.key, 'itemName', e.target.value)}
                />
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            render: (_, record) => (
                <Input
                    value={record.unitPrice}
                    type="number"
                    onChange={(e) => handleLineChange(record.key, 'unitPrice', e.target.value)}
                />
            ),
        },
        {
            title: 'Currency ID',
            dataIndex: 'currencyID',
            render: (_, record) => (
                <Input
                    value={record.currencyID}
                    onChange={(e) => handleLineChange(record.key, 'currencyID', e.target.value)}
                />
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (_, record) => (
                <Input
                    value={record.amount}
                    type="number"
                    onChange={(e) => handleLineChange(record.key, 'amount', e.target.value)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" danger onClick={() => removeInvoiceLine(record.key)}>
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <Card style={{ padding: '24px' }}>
            <Title level={3}>Create Invoice</Title>
            <Form layout="vertical" form={form}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Invoice ID" name="id" rules={[{ required: true, message: 'Please enter Invoice ID' }]}>
                            <Input placeholder="Enter Invoice ID" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Sender Name" name="senderName" rules={[{ required: true, message: 'Please enter Sender Name' }]}>
                            <Input placeholder="Enter Sender Name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Recipient Name" name="recipientName" rules={[{ required: true, message: 'Please enter Recipient Name' }]}>
                            <Input placeholder="Enter Recipient Name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Invoice Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
                            <Input type="date" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Total Amount">
                            <Input value={totalAmount} readOnly />
                        </Form.Item>
                    </Col>
                </Row>
                <Table
                    dataSource={invoiceLines}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                    footer={() => (
                        <Button type="dashed" onClick={addInvoiceLine} block>
                            Add Invoice Line
                        </Button>
                    )}
                />
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <Button type="primary" onClick={handleSubmit}>
                        Create Invoice
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default CreateInvoicePage;
