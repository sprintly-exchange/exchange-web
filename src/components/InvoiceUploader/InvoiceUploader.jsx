import React, { useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Upload, Button, Table, message } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";

const InvoiceUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [invoiceStatuses, setInvoiceStatuses] = useState([]);

  // Handle file selection
  const handleFileChange = (info) => {
    const { file } = info;
    setSelectedFile(file);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      message.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("x", "XXXXXXXX");

    try {
      setUploadStatus("Uploading...");
      message.loading("Uploading...");

      const response = await axiosInstance.post("/api/invoice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadStatus("Invoice uploaded successfully!");
        message.success("Invoice uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("An error occurred during upload.");
      message.error("An error occurred during upload.");
    }
  };

  // Fetch invoice statuses
  const fetchInvoiceStatuses = async () => {
    try {
      const response = await axiosInstance.get("/api/invoice");
      setInvoiceStatuses(response.data);
    } catch (error) {
      setUploadStatus("An error occurred while fetching statuses.");
      message.error("An error occurred while fetching statuses.");
    }
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Timestamp",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (uploadedAt) => new Date(uploadedAt).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Invoice Uploader</h1>
      <div style={{ marginBottom: "20px" }}>
        <Upload beforeUpload={() => false} onChange={handleFileChange} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Select Invoice</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          style={{ marginLeft: "10px" }}
          disabled={!selectedFile}
        >
          Upload
        </Button>
      </div>
      {uploadStatus && <p>{uploadStatus}</p>}

      <h2>Delivery Statuses</h2>
      <Button
        type="default"
        icon={<ReloadOutlined />}
        onClick={fetchInvoiceStatuses}
        style={{ marginBottom: "10px" }}
      >
        Refresh Statuses
      </Button>

      <Table
        dataSource={invoiceStatuses}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default InvoiceUploader;
