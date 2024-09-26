import axiosInstance from '../utils/axiosConfig';
import { message } from 'antd';

export class ApiClient {
  async updateData(url, data, method) {
    try {
      const response = await axiosInstance({
        url,
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: JSON.stringify(data)
      });

      return response.data;
    } catch (error) {
      console.error('error', error);
    }
  }

  async getData(url, method) {
    try {
      const response = await axiosInstance({
        url,
        method: method.toUpperCase(),
        headers: {
          "Accept": "application/json"
        }
      });

      return response.data;
    } catch (error) {
      console.error('error', error);
    }
  }
}
