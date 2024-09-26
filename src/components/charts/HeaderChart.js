import React from 'react';
import { Card, Col, Row } from 'antd';
import {
    DollarCircleOutlined,
    TrophyOutlined,
    ApiOutlined,
    RocketOutlined,
    LoadingOutlined , 
  } from "@ant-design/icons";
import { Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';
import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

function HeaderChart() {

    const [total,setTotal] = useState(0);
    const [successes,setSuccesses]  = useState(0);
    const [failures,setFailures]  = useState(0);
    const [inprocessing,setInprocessing]  = useState(0);

    const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}/api/transactions/statistics/summary`);
          const resultArray = Object.entries(response.data);
          setTotal(response.data.total);
          setFailures(response.data.failures);
          setSuccesses(response.data.successes);
          setInprocessing(response.data.inprocessing);
    
        } catch (error) {
          console.error(`There was an error getting statistics summary.`, error);

        }
      };
    
      useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, `${configManagerFE.getConfig('dashboardDataDefaultFetchInterval')}`); // Fetch data every 5 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

      function DashboardCard({ title, value, icon }) {
        return (
          <Card>
            <Space direction="horizontal">
              {icon}
              <Statistic title={title} value={value} />
            </Space>
          </Card>
        );
      }

  return (
    <Space size={20} direction="vertical">
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <RocketOutlined
            style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Total "}
          value={total}
        />
        <DashboardCard
          icon={
            <TrophyOutlined
            style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
            }}
            />
          }
          title={"Successes "}
          value={successes}
        />
        <DashboardCard
          icon={
            <ApiOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Failures"}
          value={failures}
        />
        <DashboardCard
          icon={
            <LoadingOutlined
              style={{
                color: "purple ",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"In Processing"}
          value={inprocessing}
        />
      </Space>
    </Space>
  )
}

export default HeaderChart
