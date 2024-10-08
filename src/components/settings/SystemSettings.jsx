import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosConfig';
import { message } from 'antd';
import DynamicEditableForm from '../utils/DynamicEditableForm';

function SystemSettings() {

  const [systemSettings,setSystemSettings] = useState([]);

  useEffect(() => {
    fetchSystemSettings()
  },[]);

  const fetchSystemSettings = () => {
    axiosInstance
    .get(`/api/configuration/system/settings`)
    .then((response) => {
      console.log(response.data);
      setSystemSettings(response.data);
    })
    .catch((error) => {
        message.error('There was an error fetching the data!');
    });
  }

  return (
    <div>
      <DynamicEditableForm inputData={systemSettings} apiUrl={`/api/configuration/system/settings`} httpMethod = {'PUT'}  objectName={'System Settings'} action={'Update'}/>

    </div>
  )
}

export default SystemSettings
