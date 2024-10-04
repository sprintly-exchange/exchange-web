import React from 'react';
import { Form, Input, Button, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import configManagerFE from '../configuration/configManager';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosConfig';
import userConfigManager from '../configuration/userConfigManager';
import { applyStoredColors } from '../utils/commonUtils';

const { Content } = Layout;

const LoginPage = ({ setUser }) => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const { username, password } = values;

            // Make API request to login user
            const response = await axiosInstance.post(`/api/iam/login`, { username, password });

            // Check response status and structure
            if (response.status === 200 && response.data.token) {
                const token = response.data.token;
                const decoded = jwtDecode(token);

                // Store user and token in local storage
                sessionStorage.setItem('user', JSON.stringify(decoded));
                sessionStorage.setItem('token', token);
    

                // Call setUser from props to update the parent state
                setUser(decoded);
                await userConfigManager.loadConfigFromBackend();
                applyStoredColors();
                // Redirect to dashboard or desired page after successful login
                navigate('/dashboard');
            } else {
                message.error(response.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Login failed. Please try again.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const validateUsername = (_, value) => {
        if (value && /\s/.test(value)) {
          return Promise.reject('Username cannot contain spaces');
        }
        return Promise.resolve();
      };

    return (
        <Layout className="layout">
            <Content style={{ padding: '0 50px', marginTop: '50px' }}>
                <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ textAlign: 'center' }}>Login</h2>
                    <Form
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' },{ validator: validateUsername }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default LoginPage;
