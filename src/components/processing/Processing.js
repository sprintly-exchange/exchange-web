import React, { useState } from 'react';
import { Typography, Button, Input, message, Spin } from 'antd'; // Import necessary components from antd
import CurrentProcessingTable from './CurrentProcessingTable.js';
import CodeEditor from '../codeEditor/codeEditor'; // Import the CodeEditor
import axiosInstance from '../utils/axiosConfig'; // Import axios instance for HTTP requests
import configManagerFE from '../configuration/configManager'; // Import config manager

const { Title } = Typography;

const Processing = () => {
  const [code, setCode] = useState(''); // State to store the base64-encoded code from CodeEditor
  const [processingName, setProcessingName] = useState('Default'); // State to store the processing name
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  // Function to handle code changes from the CodeEditor
  const handleCodeChange = (newCode) => {
    try {
      setCode(newCode); // Update the state with the encoded code
    } catch (error) {
      message.error('Error encoding the code. Please check your input.');
      console.error('Encoding error:', error);
    }
  };

  // Function to handle processing name input changes
  const handleNameChange = (e) => {
    setProcessingName(e.target.value); // Update the state with the processing name
  };

  // Function to handle the submit button click
  const handleSubmit = async () => {
    if (!code) {
      message.error('Please write some code before submitting.');
      return;
    }

    if (!processingName) {
      message.error('Please enter a processing name before submitting.');
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      // Encode the code from base64 before sending it to the server
      let encodedCode = "";
      encodedCode =  btoa(code);

      // Make a POST request to create a new processing record
      const response = await axiosInstance.post(
        `/api/processing`, 
        { code: encodedCode, processingName } // Send decoded code and processingName in the request body
      );

      // Handle successful response
      message.success(`Processing record created successfully with ID: ${response.data.id}`);
    } catch (error) {
      // Handle error response
      message.error(error.response.data.message);
      //message.error('Error creating processing record. Please try again.');
      //console.error('Error creating processing record:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div>
      <Title level={3}>Processing Management</Title>

      {/* Input field to capture the processing name */}
      <Input
        placeholder="Enter Processing Name"
        value={processingName}
        onChange={handleNameChange}
        style={{ marginBottom: 20 }}
      />

      {/* Include CodeEditor and pass handleCodeChange to capture the code */}
      <CodeEditor onChange={handleCodeChange} />

      {/* Submit button to create a processing record */}
      <Button 
        type="primary" 
        onClick={handleSubmit} 
        style={{ marginTop: 20 }}
        disabled={loading} // Disable button while loading
      >
        {loading ? <Spin /> : 'Create Processing Step'}
      </Button>

      {/* Pass the decoded code to CurrentProcessingTable */}
      <CurrentProcessingTable code={code} />
    </div>
  );
};

export default Processing;
