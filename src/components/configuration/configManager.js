import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';

const configManagerFE = (() => {
    // Load config from session storage or set default
    let config = JSON.parse(sessionStorage.getItem('appConfig')) || {
        theme: 'light',
        debugEnabled: false,
        dashboardDataDefaultFetchInterval: 10000,
        appVersion: 'V1.0.8',
    };

    // Save config to session storage
    const saveConfigToSession = () => {
        sessionStorage.setItem('appConfig', JSON.stringify(config));
    };

    // Save config to backend 
    //to be implemented
    const saveConfigToBackend = async () => {
        try {   
            config.id= `${process.env.REACT_APP_ID}`;
            await axiosInstance.post(`/api/configuration/app`, config);
        } catch (error) {
            console.error('Error saving config to backend', error);
        }
    };

    // Load config from backend
    const loadConfigFromBackend = async () => {
        try {
            const response = await axiosInstance.get(`/api/configuration/app/${process.env.REACT_APP_ID}`);
            config = response.data;
            saveConfigToSession();
        } catch (error) {
            console.error('Error loading config from backend', error);
        }
    };

    return {
        getConfig: (key) => config[key],
        setConfig: (key, value) => {
            config[key] = value;
            saveConfigToSession();
            saveConfigToBackend(); //to be implemented
        },
        getAllConfig: () => ({ ...config }),
        loadConfigFromBackend
    };
})();

export default configManagerFE;