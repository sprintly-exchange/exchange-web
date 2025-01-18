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

                if (field === 'amount') {
                    const amount = parseFloat(value) || 0;
                    const quantity = parseFloat(updatedLine.quantity) || 1;
                    updatedLine.unitPrice = (amount / quantity).toFixed(2);
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

    const handleSubmit = async (format) => {
        const invoiceData = form.getFieldsValue();
        invoiceData.invoiceLines = invoiceLines;

        let body;
        if (format === 'xml') {
            body = `
                <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
                    <cbc:ID>${invoiceData.id}</cbc:ID>
                    <cbc:IssueDate>${invoiceData.date}</cbc:IssueDate>
                    <cac:AccountingSupplierParty>
                        <cac:Party>
                            <cbc:PartyName>
                                <cbc:Name>${invoiceData.senderName}</cbc:Name>
                            </cbc:PartyName>
                        </cac:Party>
                    </cac:AccountingCustomerParty>
                        <cac:Party>
                            <cbc:PartyName>
                                <cbc:Name>${invoiceData.recipientName}</cbc:Name>
                            </cbc:PartyName>
                        </cac:Party>
                    </cac:AccountingCustomerParty>
                    <cac:InvoiceLines>
                        ${invoiceLines.map((line, index) => `
                            <cac:InvoiceLine>
                                <cbc:ID>${index + 1}</cbc:ID>
                                <cbc:InvoicedQuantity unitCode="EA">${line.quantity}</cbc:InvoicedQuantity>
                                <cbc:LineExtensionAmount currencyID="${line.currencyID}">${line.amount}</cbc:LineExtensionAmount>
                                <cac:Item>
                                    <cbc:Name>${line.itemName}</cbc:Name>
                                </cac:Item>
                                <cac:Price>
                                    <cbc:PriceAmount currencyID="${line.currencyID}">${line.unitPrice}</cbc:PriceAmount>
                                </cac:Price>
                            </cac:InvoiceLine>
                        `).join('')}
                    </cac:InvoiceLines>
                </Invoice>
            `;
        } else {
            body = JSON.stringify({
                Invoice: {
                    '@xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                    ID: invoiceData.id,
                    IssueDate: invoiceData.date,
                    AccountingSupplierParty: {
                        Party: { PartyName: { Name: invoiceData.senderName } },
                    },
                    AccountingCustomerParty: {
                        Party: { PartyName: { Name: invoiceData.recipientName } },
                    },
                    InvoiceLines: invoiceLines.map((line, index) => ({
                        ID: index + 1,
                        InvoicedQuantity: { '#text': line.quantity, '@unitCode': 'EA' },
                        LineExtensionAmount: { '#text': line.amount, '@currencyID': line.currencyID },
                        Item: { Name: line.itemName },
                        Price: { PriceAmount: { '#text': line.unitPrice, '@currencyID': line.currencyID } },
                    })),
                },
            });
        }

        try {
            const formData = new FormData();
            const blob = new Blob([body], { type: format === 'xml' ? 'application/xml' : 'application/json' });
            formData.append('file', blob, `invoice.${format}`);

            const response = await axios.post('/api/invoice', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('Invoice created successfully:', response.data);
            } else {
                throw new Error('Error creating invoice');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        // Columns definition remains the same
    ];

    return (
        <Card style={{ padding: '24px' }}>
            <Title level={3}>Create Invoice</Title>
            <Form layout="vertical" form={form}>
                {/* Form fields remain the same */}
                <Button type="primary" onClick={() => handleSubmit('xml')} style={{ marginRight: 8 }}>
                    Submit as XML
                </Button>
                <Button type="primary" onClick={() => handleSubmit('json')}>
                    Submit as JSON
                </Button>
            </Form>
        </Card>
    );
};

export default CreateInvoicePage;
