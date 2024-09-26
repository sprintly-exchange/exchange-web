import React from 'react'
import TransactionsPerMinuteChart from '../charts/TransactionsPerMinuteChart';
import TransactionsFlowsPerMinuteChart from '../charts/TransactionsFlowsPerMinuteChart';
import TransactionsFlowsChart from '../charts/TransactionsFlowsChart';
import './dashboard.css';
import TransactionsTextChart from '../charts/TransactionsTextChart';
import { Typography,Space } from 'antd';
import HeaderChart from '../charts/HeaderChart';
import TransactionsSummaryPerMinuteChart from '../charts/TransactionsSummayPerMinuteChart';
import SystemQueuesChart from '../charts/SystemQueuesChart';

const { Title } = Typography;

function DashBoard() {
  return (
    <>
    
     <Typography.Title level={3}>Business Cockpit</Typography.Title>
    
    <div>
      <div class="grid-container">
        <div class="grid-item"><HeaderChart></HeaderChart></div>
        <div class="grid-item"><TransactionsTextChart></TransactionsTextChart></div>  
        <div class="grid-item"><TransactionsSummaryPerMinuteChart></TransactionsSummaryPerMinuteChart></div>
        <div class="grid-item"><TransactionsFlowsChart></TransactionsFlowsChart></div>  
        <div class="grid-item"><TransactionsFlowsPerMinuteChart></TransactionsFlowsPerMinuteChart></div>
        <div class="grid-item"><TransactionsPerMinuteChart></TransactionsPerMinuteChart></div>
        <div class="grid-item"><SystemQueuesChart></SystemQueuesChart></div>
      </div>
    
    </div>
    <div>
      
    </div>


    </>
  )
}

export default DashBoard
