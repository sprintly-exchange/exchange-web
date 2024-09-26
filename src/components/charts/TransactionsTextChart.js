import React, { useState, useEffect, } from 'react';
import { Table} from 'antd';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

const TransactionsTextChart = () => {
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({
    current: 10,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/transactions/statistics/flows/count`);
      const resultArray = Object.entries(response.data);
      const jsonObjectArray = Object.entries(response.data).map(([key, value]) => ({ key, value }));

      setData(jsonObjectArray);
    } catch (error) {
      console.error(`There was an error getting minute transaction statistics.`, error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, `${configManagerFE.getConfig('dashboardDataDefaultFetchInterval')}`); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const columns = [
    {
      title: 'Business Transaction Flow',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Number of requests',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };


  return (
    <div>
      <Table dataSource={data} columns={columns} 
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => handleTableChange({ current: page, pageSize: pageSize }),
          onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size }),
        }}
      />
    </div>
  );
};

export default TransactionsTextChart;
