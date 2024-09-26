import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import JSONFormatter from 'json-formatter-js';
import xmlFormatter from 'xml-formatter';

const DisplayBox = ({ inputData, visible, onClose }) => {
  const [formattedData, setFormattedData] = useState('');
  const [dataType, setDataType] = useState('');

  useEffect(() => {
    if (typeof inputData === 'string') {
      if (inputData.includes("UNH+") && inputData.includes("UNZ+")) {
        setDataType('EDIFACT');
        setFormattedData(inputData.replace(/\n/g, '<br />'));
      } else if (isJsonString(inputData)) {
        setDataType('JSON');
        formatJson(inputData);
      } else if (isXmlString(inputData)) {
        setDataType('XML');
        formatXml(inputData);
      } else {
        setDataType('Text');
        setFormattedData(inputData.replace(/\n/g, '<br />'));
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
      const formatter = new JSONFormatter(jsonObj, Infinity);
      setFormattedData(formatter.render().innerHTML.replace(/\n/g, '<br />'));
    } catch (e) {
      setFormattedData('<span style="color: red;">Invalid JSON</span>');
    }
  };

  const formatXml = (xml) => {
    try {
      const formatted = xmlFormatter(xml, { indentation: '  ', collapseContent: true });
      setFormattedData(formatted.replace(/\n/g, '<br />'));
    } catch (e) {
      setFormattedData('<span style="color: red;">Invalid XML</span>');
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
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        <div dangerouslySetInnerHTML={{ __html: formattedData }} />
      </pre>
    </Modal>
  );
};

export default DisplayBox;
