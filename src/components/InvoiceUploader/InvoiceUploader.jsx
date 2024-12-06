import React, { useState } from "react";
import axiosInstance from "../utils/axiosConfig";

const InvoiceUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [invoiceStatuses, setInvoiceStatuses] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("x", 'XXXXXXXX');
  
    try {
      console.log('FormData:', formData); // Debugging formData
  
      setUploadStatus("Uploading...");
  
      // Assuming you want to use axios for the POST request
      const response = await axiosInstance.post('/api/invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios will handle this for you, but you can set it explicitly
        },
      });
  
      if (response.status === 200) {
        setUploadStatus("Invoice uploaded successfully!");
      }
    } catch (error) {
      console.error('Upload error:', error); // Log the error for debugging
      setUploadStatus("An error occurred during upload.");
    }
  };

  // Fetch invoice statuses
  const fetchInvoiceStatuses = async () => {
    try {
      // Simulate API call
   
      const response = await axiosInstance.get("/api/invoice")
      .then( response => {
        setInvoiceStatuses(response.data);
      }).catch(error => {
        setUploadStatus("Failed to fetch statuses.");
      })
    } catch (error) {
      setUploadStatus("An error occurred while fetching statuses.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Invoice Uploader</h1>
      <div>
        <label>
          Upload Invoice:
          <input
            type="file"
            accept=".xml,.pdf"
            onChange={handleFileChange}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </div>
      {uploadStatus && <p>{uploadStatus}</p>}

      <h2>Delivery Statuses</h2>
      <button onClick={fetchInvoiceStatuses} style={{ marginBottom: "10px" }}>
        Refresh Statuses
      </button>
      {invoiceStatuses.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {invoiceStatuses.map((status) => (
              <tr key={status.id}>
                <td>{status.id}</td>
                <td>{status.status}</td>
                <td>{status.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No invoice statuses available.</p>
      )}
    </div>
  );
};

export default InvoiceUploader;
