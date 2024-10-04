import React from 'react';
import { Form, Input, Button, Divider, message, Layout, Menu } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { ApiClient } from '../utils/ApiClient';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';
import userConfigManager from '../configuration/userConfigManager';
import { applyStoredColors } from '../utils/commonUtils';
import YouTubeChannelLink from '../media/YouTubeChannelLink';
import YouTubeChannelVideos from '../media/YouTubeChannelLink';

const { Header, Content } = Layout;

const SignUpPage = ({ setUser }) => {
    const onFinish = async (values) => {
        try {
           const {id: organizationId } = await new ApiClient().getData(`/api/openapis/DefaultOrganization`, 'GET');

            // Construct user object from form values
            const user = {
                username: values.username,
                password: values.password,
                email: values.email,
                organizationId: organizationId, // Assuming organization is fixed for signup
            };

            // Make API request to register user
            const response = await new ApiClient().updateData(`/api/users/register-user`, user, 'POST');
            // Check response status
            if (response.status.toUpperCase() === 'SUCCESS') {
                message.success('Sign up successful!');
                // Automatically log in the user after successful signup
                loginUser(user.username, user.password);
            }
        } catch (error) {
            message.error('Sign up failed. User may be already exists if not try again.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const decoded = jwtDecode(token);

        // Store user and token in local storage
        sessionStorage.setItem('user', JSON.stringify(decoded));
        sessionStorage.setItem('token', token);

        // Call setUser from props to update the parent state
        setUser(decoded);
        userConfigManager.loadConfigFromBackend();
        message.success('Login successful!');
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
        message.error('Login failed. Please try again.');
    };

    const validateUsername = (_, value) => {
        if (value && /\s/.test(value)) {
          return Promise.reject('Username cannot contain spaces');
        }
        return Promise.resolve();
      };

    const loginUser = async (username, password) => {
        try {
            // Make API request to login user
            const response = await new ApiClient().updateData(`/api/iam/login`, { username, password }, 'POST');
            
            // Check response status
            if (response.status === 'success') {
                const token = response.token;
                const decoded = jwtDecode(token);

                // Store user and token in local storage
                sessionStorage.setItem('user', JSON.stringify(decoded));
                sessionStorage.setItem('token', token);

                // Call setUser from props to update the parent state
                setUser(decoded);

                //load user config
                message.success('Login successful!');
            } else {
                message.error(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Login failed. Please try again.');
        }
    };

    return (
        <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['signup']}>
                    <Menu.Item key="signup" style={{ float: 'right' }}>
                        <Button type="link" href="/login">
                            Login
                        </Button>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
                    <Form
                        name="signup-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' },{ validator: validateUsername }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username"  />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email address!' },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>
                        <Divider>Or sign up with</Divider>
                        <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginFailure}
                                render={renderProps => (
                                    <Button
                                        type="primary"
                                        icon={<FaGoogle />}
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        style={{ width: '100%' }}
                                    >
                                        Sign up with Google
                                    </Button>
                                )}
                            />
                        </GoogleOAuthProvider>
                </div>
                <div>
                <YouTubeChannelVideos></YouTubeChannelVideos>
                </div>
            </Content>
        </Layout>
    );
};

export default SignUpPage;
