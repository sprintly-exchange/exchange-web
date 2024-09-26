import React, { useState, useEffect } from 'react';
import { Select, Spin, message } from 'antd';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

import axios from 'axios';

const { Option } = Select;

const DynamicSelect = ({fetchUrl, selectTypeText,onDataChange,componentId}) => {
  const [loading, setLoading] = useState(true);
  //const [options, setOptions] = useState([]);

  
  //accessing child propers from parent
  let dynamicSelectChildVariables=[];
  const [childState, setChildState] = useState(dynamicSelectChildVariables);
  useEffect(() => {
    onDataChange(childState);
  }, [childState, onDataChange]);

  const updateState = () => {
    setChildState(dynamicSelectChildVariables);
  };


  //Select option variables
  const [types, setTypes] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      await axiosInstance.get(fetchUrl)
      .then((response) => {
        //set connnection names to option list
        setTypes(response.data.map(option => option.connectionName || option.processingName));
        //set data to use it in later stages
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });   
    } catch (error) {
      console.error('Error fetching options:', error);
      setLoading(false);
    }
  };

  const handleTypeChange = (value) => {
    const selectedOption = data.find(data => data.connectionName === value || data.processingName === value);
    if (selectedOption) {
      dynamicSelectChildVariables[0] = componentId;
      dynamicSelectChildVariables[1] = selectedOption.id;
      dynamicSelectChildVariables[2] = selectedOption.connectionName || selectedOption.processingName;
      updateState();//indicate to parent
      console.log("Child-dynamicSelectChildVariables",dynamicSelectChildVariables);
    } else {
      ;
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h3>{selectTypeText}</h3>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Select style={{ width: '70%', marginBottom: '20px' }} placeholder="Select a type" onChange={handleTypeChange}> 
          {types.map(type => ( 
            
          <Option key={type} value={type}> {type}</Option> 
          ))}
          </Select>
        </>
      )}
    </div>
  );
};

export default DynamicSelect;
