import React, { useState, useEffect } from 'react';
import TransactionsPerMinute from './TransactionsPerMinute';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

const TransactionsPerMinuteChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Transactions per minute',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 2,
      },
    ],
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/api/transactions/statistics/minute`);
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
            label: 'Transactions per minute',
            data: dataValues,
            borderColor: 'rgba(75,192,192,1)',
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
      <TransactionsPerMinute data={data} options={options} />
    </div>
  );
};

export default TransactionsPerMinuteChart;
