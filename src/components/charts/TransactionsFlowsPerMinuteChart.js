import React, { useState, useEffect } from 'react';
import TransactionsFlowsPerMinute from './TransactionsFlowsPerMinute';
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

function generateColor() {
  const hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += hexArray[Math.floor(Math.random() * 16)];
  }
  return `#${code}`;
}

async function updateStat() {
  let labelValues = [];
  let dataValues = [];
  let datasetsConcat = [];
  let timestamps = [];

  try {
    const response = await axiosInstance.get(`/api/transactions/statistics/flows/minute`);
    const flowCounts = [];

    for (const [timestamp, flows] of Object.entries(response.data)) {
      timestamps.push(new Date(timestamp).toLocaleString());
      flowCounts.push(flows);
    }

    const uniqueKeys = new Set();
    flowCounts.forEach(flow => {
      Object.keys(flow).forEach(key => {
        uniqueKeys.add(key);
      });
    });

    const separatedArrays = {};
    uniqueKeys.forEach(key => {
      separatedArrays[key] = [];
    });

    flowCounts.forEach(flow => {
      uniqueKeys.forEach(key => {
        separatedArrays[key].push(flow[key] || 0);
      });
    });

    uniqueKeys.forEach(key => {
      const objToAssign = {
        label: key,
        data: separatedArrays[key],
        borderColor: generateColor(),
        borderWidth: 2,
      };
      datasetsConcat.push(objToAssign);
    });

    return {
      labels: timestamps,
      datasets: datasetsConcat,
    };
  } catch (error) {
    console.error(`There was an error getting minute flows statistics.`, error);
    return {
      labels: [],
      datasets: [],
    };
  }
}

const TransactionsFlowsPerMinuteChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const newData = await updateStat();
      setData(newData);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, `${configManagerFE.getConfig('dashboardDataDefaultFetchInterval')}`); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const [options, setOptions] = useState({
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
      <TransactionsFlowsPerMinute data={data} options={options} />
    </div>
  );
};

export default TransactionsFlowsPerMinuteChart;
