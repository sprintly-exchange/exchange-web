import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';
import configManagerFE from './configManager';

const userConfigManager = (() => {
    // Function to load userConfig from session storage
    const loadConfigFromSession = () => {
        try {
            const storedConfig = sessionStorage.getItem('userConfig');
            return storedConfig ? JSON.parse(storedConfig) : null;
        } catch (error) {
            console.error('Failed to parse userConfig from sessionStorage:', error);
            return null;
        }
    };

    // Load userConfig from session storage or set default
    let userConfig = loadConfigFromSession() || { appColors: {} };

    // Save userConfig to session storage
    const saveConfigToSession = () => {
        sessionStorage.setItem('userConfig', JSON.stringify(userConfig));
    };

    // Save userConfig to backend
    const saveConfigToBackend = async () => {
        try {
            await axiosInstance.post(`/api/configuration/user`, userConfig);
        } catch (error) {
            console.error('Error saving userConfig to backend', error);
        }
    };

    // Load userConfig from backend
    const loadConfigFromBackend = async () => {
        try {
            const response = await axiosInstance.get(`/api/configuration/user`);
            userConfig = response.data || { appColors: {} }; // Ensure appColors is an object
            saveConfigToSession();
        } catch (error) {
            console.error('Error loading userConfig from backend', error);
        }
    };

    return {
        getConfig: (key) => userConfig[key],
        setConfig: (key, value) => {
            if (typeof userConfig[key] === 'object' && userConfig[key] !== null && typeof value === 'object') {
                userConfig[key] = { ...userConfig[key], ...value };
            } else {
                userConfig[key] = value;
            }
            saveConfigToSession();
            saveConfigToBackend();
        },
        getAllConfig: () => ({ ...userConfig }),
        loadConfigFromBackend
    };
})();

export default userConfigManager;
