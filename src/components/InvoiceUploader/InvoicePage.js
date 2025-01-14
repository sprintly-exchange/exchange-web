import React from 'react'
import InvoiceUploader from './InvoiceUploader';
import CreateInvoice from './CreateInvoice';
import CreateInvoicePage from './CreateInvoicePage';

const InvoicePage = () => {
  return (
    <div>
        <InvoiceUploader></InvoiceUploader>
        <CreateInvoice></CreateInvoice>
        <CreateInvoicePage></CreateInvoicePage>
    </div>
  )
}

export default InvoicePage