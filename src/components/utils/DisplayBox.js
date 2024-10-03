import React, { useState, useEffect } from 'react';
import { Button, Modal, Input } from 'antd';
import JSONFormatter from 'json-formatter-js';
import xmlFormatter from 'xml-formatter';

const DisplayBox = ({ inputData, visible, onClose }) => {
  const [formattedData, setFormattedData] = useState('');
  const [dataType, setDataType] = useState('');

  useEffect(() => {
    if (typeof inputData === 'string') {
      inputData= inputData.replace(/^"|"$/g, '');
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
      //const formatter = new JSONFormatter(jsonObj, Infinity);
      //setFormattedData(formatter.render().innerText);
      setFormattedData(json);
    } catch (e) {
      setFormattedData('Invalid JSON');
    }
  };

  const formatXml = (xml) => {
    try {
      //const formatted = xmlFormatter(xml, { indentation: '  ', collapseContent: true });
      //setFormattedData(formatted);
      setFormattedData(xml);
    } catch (e) {
      setFormattedData('Invalid XML');
    }
  };

  return (
    <Modal
      title={`Formatted ${dataType}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width="80%"
      style={{ maxWidth: '100%' }}
    >
      {/* Editable Rich Text Box */}
      <div
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
