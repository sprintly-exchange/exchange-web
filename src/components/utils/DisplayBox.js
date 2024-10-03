import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'antd';

const DisplayBox = ({ inputData, visible, onClose }) => {
  const [formattedData, setFormattedData] = useState('');
  const [dataType, setDataType] = useState('');
  const contentRef = useRef(null); // Reference for the editable div

  useEffect(() => {
    if (typeof inputData === 'string') {
      inputData = inputData.replace(/^"|"$/g, '');
      if (inputData.includes("UNH+") && inputData.includes("UNZ+")) {
        setDataType('EDIFACT');
        setFormattedData(inputData);
      } else if (isJsonString(inputData)) {
        setDataType('JSON');
        formatJson(inputData);
      } else if (isXmlString(inputData)) {
        setDataType('XML');
        formatXml(inputData);
      } else {
        setDataType('Text');
        setFormattedData(inputData);
      }
    } else {
      setDataType('Binary');
      setFormattedData('Binary data cannot be displayed in text format.');
    }
  }, [inputData]);

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isXmlString = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'application/xml');
    return !doc.querySelector('parsererror');
  };

  const formatJson = (json) => {
    try {
      const jsonObj = JSON.parse(json);
      setFormattedData(json);
    } catch (e) {
      setFormattedData('Invalid JSON');
    }
  };

  const formatXml = (xml) => {
    try {
      setFormattedData(xml);
    } catch (e) {
      setFormattedData('Invalid XML');
    }
  };

  // Function to save the content as a text file
  const saveToFile = () => {
    const content = contentRef.current.innerText; // Get the edited content
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted_data.txt'; // Default filename
    link.click();
  };

  return (
    <Modal
      title={`Formatted ${dataType}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="save" onClick={saveToFile}>
          Save
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width="80%"
      style={{ maxWidth: '100%' }}
    >
      {/* Editable Rich Text Box */}
      <div
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          padding: '10px',
          minHeight: '300px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          backgroundColor: '#f6f8fa',
        }}
      >
        {formattedData}
      </div>
    </Modal>
  );
};

export default DisplayBox;
