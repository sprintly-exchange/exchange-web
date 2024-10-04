import React, { useState, useEffect } from 'react';
import TransactionsFlows from './TransactionsFlows';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

const TransactionsFlowsChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Transactions per minute',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/api/transactions/statistics/flows/count`);
      const resultArray = Object.entries(response.data);
      const labelValues = [];
      const dataValues = [];

      resultArray.forEach(([key, value]) => {
        labelValues.push(key);
        dataValues.push(parseInt(value, 10));
      });

      setData({
        labels: labelValues,
        datasets: [
          {
            label: '',
            data: dataValues,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: [
             
  'rgba(0, 128, 0, 0.2)',       // Green
  'rgba(255, 99, 132, 0.2)',    // Red
  'rgba(255, 159, 64, 0.2)',    // Orange
  'rgba(255, 205, 86, 0.2)',    // Yellow
  'rgba(75, 192, 192, 0.2)',    // Teal
  'rgba(54, 162, 235, 0.2)',    // Blue
  'rgba(153, 102, 255, 0.2)',   // Purple
  'rgba(201, 203, 207, 0.2)'    // Gray
            ],
            borderWidth: 2,
            
          },
        ],
      });
    } catch (error) {
      console.error(`There was an error getting minute transaction statistics.`, error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, `${configManagerFE.getConfig('dashboardDataDefaultFetchInterval')}`); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const [options] = useState({
    responsive: true,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  });

  return (
    <div>
      <TransactionsFlows data={data} options={options} />
    </div>
  );
};

export default TransactionsFlowsChart;
