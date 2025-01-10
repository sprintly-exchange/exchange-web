import React from 'react'
import InvoiceUploader from './InvoiceUploader';
import CreateInvoice from './CreateInvoice';

const InvoicePage = () => {
  return (
    <div>
        <InvoiceUploader></InvoiceUploader>
        <CreateInvoice></CreateInvoice>
    </div>
  )
}

export default InvoicePage