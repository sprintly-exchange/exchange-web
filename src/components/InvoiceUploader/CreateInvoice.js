import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const CreateInvoice = () => {
    const [invoiceData, setInvoiceData] = useState({
        id: '',
        senderName: '',
        recipientName: '',
        amount: '',
        date: '',
        invoiceLines: [
            {
                quantity: '2',
                itemName: 'Product A',
                unitCode: 'EA',
                currencyID: 'EUR',
                amount: ''
            }
        ]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData({
            ...invoiceData,
            [name]: value
        });
    };

    const handleLineChange = (index, e) => {
        const { name, value } = e.target;
        const newInvoiceLines = [...invoiceData.invoiceLines];
        newInvoiceLines[index][name] = value;

        if (name === 'quantity' || name === 'amount') {
            const quantity = parseFloat(newInvoiceLines[index].quantity) || 0;
            const amount = parseFloat(newInvoiceLines[index].amount) || 0;
            newInvoiceLines[index].amount = (quantity * amount).toFixed(2);
        }

        setInvoiceData({
            ...invoiceData,
            invoiceLines: newInvoiceLines
        });
        calculateTotalAmount(newInvoiceLines);
    };

    const addInvoiceLine = () => {
        const newInvoiceLines = [
            ...invoiceData.invoiceLines,
            { quantity: '', itemName: '', unitCode: '', currencyID: '', amount: '' }
        ];
        setInvoiceData({
            ...invoiceData,
            invoiceLines: newInvoiceLines
        });
        calculateTotalAmount(newInvoiceLines);
    };

    const calculateTotalAmount = (invoiceLines) => {
        const totalAmount = invoiceLines.reduce((total, line) => {
            return total + parseFloat(line.amount || 0);
        }, 0);
        setInvoiceData((prevData) => ({
            ...prevData,
            amount: totalAmount.toFixed(2)
        }));
    };

    const generatePDF = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        doc.text(`Invoice ID: ${invoiceData.id}`, 10, 10);
        doc.text(`Sender Name: ${invoiceData.senderName}`, 10, 20);
        doc.text(`Recipient Name: ${invoiceData.recipientName}`, 10, 30);
        doc.text(`Amount: ${invoiceData.amount}`, 10, 40);
        doc.text(`Date: ${invoiceData.date}`, 10, 50);

        invoiceData.invoiceLines.forEach((line, index) => {
            doc.text(`Item ${index + 1}: ${line.itemName}`, 10, 60 + index * 10);
            doc.text(`Quantity: ${line.quantity}`, 10, 70 + index * 10);
            doc.text(`Amount: ${line.amount}`, 10, 80 + index * 10);
        });

        doc.save('invoice.pdf');
    };

    const handleSubmit = async (format) => {
        const url = '/api/invoices';
        const headers = {
            'Content-Type': format === 'xml' ? 'application/xml' : 'application/json'
        };

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
                    </cac:AccountingSupplierParty>
                    <cac:AccountingCustomerParty>
                        <cac:Party>
                            <cbc:PartyName>
                                <cbc:Name>${invoiceData.recipientName}</cbc:Name>
                            </cbc:PartyName>
                        </cac:Party>
                    </cac:AccountingCustomerParty>
                    <cac:InvoiceLines>
                        ${invoiceData.invoiceLines.map((line, index) => `
                            <cac:InvoiceLine>
                                <cbc:ID>${index + 1}</cbc:ID>
                                <cbc:InvoicedQuantity unitCode="${line.unitCode}">${line.quantity}</cbc:InvoicedQuantity>
                                <cbc:LineExtensionAmount currencyID="${line.currencyID}">${line.amount}</cbc:LineExtensionAmount>
                                <cac:Item>
                                    <cbc:Name>${line.itemName}</cbc:Name>
                                </cac:Item>
                                <cac:Price>
                                    <cbc:PriceAmount currencyID="${line.currencyID}">${(line.amount / line.quantity).toFixed(2)}</cbc:PriceAmount>
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
                        Party: {
                            PartyName: { Name: invoiceData.senderName },
                        },
                    },
                    AccountingCustomerParty: {
                        Party: {
                            PartyName: { Name: invoiceData.recipientName },
                        },
                    },
                    InvoiceLines: {
                        InvoiceLine: invoiceData.invoiceLines.map((line, index) => ({
                            ID: index + 1,
                            InvoicedQuantity: { '#text': line.quantity, '@unitCode': line.unitCode },
                            LineExtensionAmount: { '#text': line.amount, '@currencyID': line.currencyID },
                            Item: { Name: line.itemName },
                            Price: { PriceAmount: { '#text': (line.amount / line.quantity).toFixed(2), '@currencyID': line.currencyID } },
                        })),
                    },
                }
            });
        }

        try {
            const response = await axiosInstance.post(url, body, { headers });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Invoice created successfully:', result);
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('json'); }}>
            <div>
                <label>
                    Invoice ID:
                    <input type="text" name="id" placeholder="Invoice ID" onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>
                    Sender Name:
                    <input type="text" name="senderName" placeholder="Sender Name" onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>
                    Recipient Name:
                    <input type="text" name="recipientName" placeholder="Recipient Name" onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>
                    Amount:
                    <input type="text" name="amount" placeholder="Amount" value={invoiceData.amount} readOnly />
                </label>
            </div>
            <div>
                <label>
                    Date:
                    <input type="date" name="date" onChange={handleInputChange} />
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Item Name</th>
                        <th>Unit Code</th>
                        <th>Currency ID</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.invoiceLines.map((line, index) => (
                        <tr key={index}>
                            <td>
                                <input type="number" name="quantity" placeholder="Quantity" value={line.quantity} onChange={(e) => handleLineChange(index, e)} />
                            </td>
                            <td>
                                <input type="text" name="itemName" placeholder="Item Name" value={line.itemName} onChange={(e) => handleLineChange(index, e)} />
                            </td>
                            <td>
                                <input type="text" name="unitCode" placeholder="Unit Code" value={line.unitCode} onChange={(e) => handleLineChange(index, e)} />
                            </td>
                            <td>
                                <input type="text" name="currencyID" placeholder="Currency ID" value={line.currencyID} onChange={(e) => handleLineChange(index, e)} />
                            </td>
                            <td>
                                <input type="text" name="amount" placeholder="Amount" value={line.amount} onChange={(e) => handleLineChange(index, e)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" onClick={addInvoiceLine}>Add Invoice Line</button>
            <button type="button" onClick={() => handleSubmit('json')}>Submit</button>
        </form>
    );
};

export default CreateInvoice;
