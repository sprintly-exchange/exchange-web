import React, { useEffect, useState } from 'react';
import { Switch, message, Typography, Input , Select} from 'antd';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';
import Settings from '../settings/settings';

const { Title } = Typography;

const AdminConfig = () => {
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const onLoadFunction = () => {
            console.log(`Requesting api server status of demo mode.`);
            checkStatus();
        }
    
        onLoadFunction();
    }, []); // Empty dependency array ensures this runs only once on mount

    function checkStatus() {
        axiosInstance.get(`/api/demo/status`)
            .then(response => {
                console.log('Demo mode status', response.data.status);
                setEnabled(response.data.status);
            })
            .catch(error => {
                message.error(`Error getting demo status.!`);
            });
    }

    const demoModeChange = () => {
        axiosInstance.get(`/api/demo/toggle`)
            .then(response => {
                console.log('Demo mode switch status', response.status);
                checkStatus();
            })
            .catch(error => {
                message.error(`Error enabling/disabling demo mode.!`);
            });
    };

    const updateConfig = (event) => {
        console.log(`event received :`,event);
        if( Number(event.target.value) < 5000 ){
            message.error("Minimum should be 5000 ms");
            return;
        }
        configManagerFE.setConfig(event.target.name, event.target.value);
        console.log(`${event.target.name} set to: `, configManagerFE.getConfig(event.target.name));
    }

    const user = JSON.parse(sessionStorage.getItem('user'));

    return (
        <>
            {user.name === 'Admin' && (
                <div>
                    <Typography.Title level={3} >Configuration Management </Typography.Title>
                    <Title level={5} >Enable Demo Mode: <Switch style={{ paddingTop:10,backgroundColor: `${configManagerFE.getConfig('globalColorButtonBackground')}`}} value={enabled} onChange={demoModeChange} /></Title>
                    <Title level={5} >Dashboard Fetch Interval(ms): <Input  name="dashboardDataDefaultFetchInterval" onPressEnter={updateConfig} autoSize={{ minRows: 1, maxRows: 2 }} defaultValue={configManagerFE.getConfig('dashboardDataDefaultFetchInterval')} /></Title>
                </div>
            )}
            <div>
                <Settings />
            </div>
        </>
    )
}

export default AdminConfig;
