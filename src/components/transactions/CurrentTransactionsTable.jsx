    import React, { Component, useEffect } from 'react';
    import { Table, Spin, message, Button, Select, Typography, DatePicker,Space,Input } from 'antd';
    import { DownloadOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
    import axiosInstance from '../utils/axiosConfig';
    import configManagerFE from '../configuration/configManager';
    import DisplayBox from '../utils/DisplayBox';
    import { handleDownlaod } from './TransactionUtils';
    import './TransactionTable.css';

    const { Text } = Typography;

    class CurrentTransactionsTable extends Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedItems: ['index', 'flowName','messageId','messageType' ,'processingTime', 'status', 'pickupName', 'senderId','downloadPI', 'deliveryName','receiverId','downloadDO','processingError'], // Default selected columns
                tempSelectedItems: [], // Temporary selection state
                loading: true,
                data: [],
                pickupProtocols: [],
                deliveryProtocols: [],
                flowNames: [],
                overallStatus: [],
                pickupNames: [],
                deliveryNames: [],
                pickupHosts: [],
                deliveryHosts: [],
                senderId: [],
                receiverId: [],
                messageId: [],
                sliderValueRelativeRangeMin: 1,
                startDate: new Date().getTime() - 1 * 60000,
                endDate: new Date().getTime(),
                loadingTriggerCount: 0,
                transactionMessageDisplayContent: '',
                filters: {}, // State to store filter values
                modalVisible: false,
                searchMessageId: undefined,
                searchSenderId: undefined,
                searchReceiverId: undefined,
            };

            this.columns = [
                {
                    title: 'Index Number',
                    dataIndex: 'index',
                    key: 'index',
                    render: (text, record, index) => index + 1,
                    defaultChecked: true,
                },
                {
                    title: 'Flow Name',
                    dataIndex: 'flowName',
                    key: 'flowName',
                    filters: [],
                    onFilter: (value, record) => record.flowName.indexOf(value) === 0,
                    sorter: (a, b) => a.flowName.localeCompare(b.flowName),
                    sortDirections: ['descend', 'ascend'],
                    defaultChecked: true,
                },
                {
                    title: 'Processing Time',
                    dataIndex: 'processingTime',
                    key: 'processingTime',
                    defaultChecked: true,
                },
                {
                    title: 'Overall Status',
                    dataIndex: 'status',
                    key: 'status',
                    filters: [],
                    onFilter: (value, record) => record.status.indexOf(value) === 0,
                    sorter: (a, b) => a.status.localeCompare(b.status),
                    sortDirections: ['descend', 'ascend'],
                    defaultChecked: true,
                },
                {
                    title: 'Mesage Type',
                    dataIndex: 'messageType',
                    key: 'messageType',
                    filters: [],
                    onFilter: (value, record) => record.messageType.indexOf(value) === 0,
                    sorter: (a, b) => a.messageType.localeCompare(b.messageType),
                    sortDirections: ['descend', 'ascend'],
                    defaultChecked: true,
                },
                {
                    title: 'Message ID',
                    dataIndex: 'messageId',
                    key: 'messageId',
                    filters: [],
                    onFilter: (value, record) => record.messageId.indexOf(value) === 0,
                    sorter: (a, b) => a.messageId.localeCompare(b.messageId),
                    sortDirections: ['descend', 'ascend'],
                    defaultChecked: true,
                },
                {
                    title: 'Pickup Name',
                    dataIndex: 'pickupName',
                    key: 'pickupName',
                    filters: [],
                    onFilter: (value, record) => record.pickupName.indexOf(value) === 0,
                    sorter: (a, b) => a.pickupName.localeCompare(b.pickupName),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Pickup Protocol',
                    dataIndex: 'pickupProtocol',
                    key: 'pickupProtocol',
                    filters: [],
                    onFilter: (value, record) => record.pickupProtocol.indexOf(value) === 0,
                    sorter: (a, b) => a.pickupProtocol.localeCompare(b.pickupProtocol),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Pickup Host',
                    dataIndex: 'pickupHost',
                    key: 'pickupHost',
                    filters: [],
                    onFilter: (value, record) => record.pickupHost.indexOf(value) === 0,
                    sorter: (a, b) => a.pickupHost.localeCompare(b.pickupHost),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Pickup Port',
                    dataIndex: 'pickupPort',
                    key: 'pickupPort',
                },
                {
                    title: 'Pickup Path',
                    dataIndex: 'pickupPath',
                    key: 'pickupPath',
                    sorter: (a, b) => a.pickupPath.localeCompare(b.pickupPath),
                },
                {
                    title: 'Pickup Status',
                    dataIndex: 'pickupStatus',
                    key: 'pickupStatus',
                    sorter: (a, b) => a.pickupStatus.localeCompare(b.pickupStatus),
                },
                {
                    title: 'Pickup Status Code',
                    dataIndex: 'pickupStatusCode',
                    key: 'pickupStatusCode',
                    sorter: (a, b) => a.pickupStatusCode.localeCompare(b.pickupStatusCode),
                },
                {
                    title: 'Sender Id',
                    dataIndex: 'senderId',
                    key: 'senderId',
                    filters: [],
                    onFilter: (value, record) => record.senderId.indexOf(value) === 0,
                    sorter: (a, b) => a.senderId.localeCompare(b.senderId),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Download Pickup Inbound',
                    key: 'downloadPI',
                    render: (text, record) => (
                        <Button name="PI" onClick={() => this.downloadMessage(record, 'PI')} icon={<DownloadOutlined />} />
                    ),
                },
                {
                    title: 'Download Pickup Outbound',
                    key: 'downloadPO',
                    render: (text, record) => (
                        <Button name="PO" onClick={() => this.downloadMessage(record, 'PO')} icon={<DownloadOutlined />} />
                    ),
                },
                {
                    title: 'Delivery Name',
                    dataIndex: 'deliveryName',
                    key: 'deliveryName',
                    filters: [],
                    onFilter: (value, record) => record.deliveryName.indexOf(value) === 0,
                    sorter: (a, b) => a.deliveryName.localeCompare(b.deliveryName),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Delivery Protocol',
                    dataIndex: 'deliveryProtocol',
                    key: 'deliveryProtocol',
                    filters: [],
                    onFilter: (value, record) => record.deliveryProtocol.indexOf(value) === 0,
                    sorter: (a, b) => a.deliveryProtocol.localeCompare(b.deliveryProtocol),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Delivery Host',
                    dataIndex: 'deliveryHost',
                    key: 'deliveryHost',
                    filters: [],
                    onFilter: (value, record) => record.deliveryHost.indexOf(value) === 0,
                    sorter: (a, b) => a.deliveryHost.localeCompare(b.deliveryHost),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Delivery Port',
                    dataIndex: 'deliveryPort',
                    key: 'deliveryPort',
                },
                {
                    title: 'Delivery Path',
                    dataIndex: 'deliveryPath',
                    key: 'deliveryPath',
                    sorter: (a, b) => a.deliveryPath.localeCompare(b.deliveryPath),
                },
                {
                    title: 'Delivery Status',
                    dataIndex: 'deliveryStatus',
                    key: 'deliveryStatus',
                    sorter: (a, b) => a.deliveryStatus.localeCompare(b.deliveryStatus),
                },
                {
                    title: 'Delivery Status Code',
                    dataIndex: 'deliveryStatusCode',
                    key: 'deliveryStatusCode',
                    sorter: (a, b) => a.deliveryStatusCode.localeCompare(b.deliveryStatusCode),
                },
                {
                    title: 'Receiver Id',
                    dataIndex: 'receiverId',
                    key: 'receiverId',
                    sorter: (a, b) => a.receiverId.localeCompare(b.receiverId),
                    filters: [],
                    onFilter: (value, record) => record.receiverId.indexOf(value) === 0,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Download Delivery Inbound',
                    key: 'downloadDI',
                    render: (text, record) => (
                        <Button name="DI" onClick={() => this.downloadMessage(record, 'DI')} icon={<DownloadOutlined />} />
                    ),
                },
                {
                    title: 'Download Delivery Outbound',
                    key: 'downloadDO',
                    render: (text, record) => (
                        <Button name="DO" onClick={() => this.downloadMessage(record, 'DO')} icon={<DownloadOutlined />} />
                    ),
                },
                {
                    title: 'Processing Error',
                    dataIndex: 'processingError',
                    key: 'processingError',
                    render: (text, record) => (
                            <Button 
                                type="link" 
                                onClick={() => {
                                    this.setState({ transactionMessageDisplayContent: record.processingError });
                                    this.showModal();
                                }}
                                icon={<ExclamationCircleOutlined />}
                            >
                            </Button>
                        
                    ),
                },
            ];
        }

        rowClassName = (record) => {
            return record.status.toUpperCase() !== 'SUCCESS' ? 'error-row' : 'success-row';
        };
        
        // Function to handle OK button click
        handleOk = () => {
            this.setState({ selectedItems: [...this.state.tempSelectedItems] }); // Update selectedItems with tempSelectedItems
        };

        // Function to handle Cancel button click
        handleCancel = () => {
            this.setState({ tempSelectedItems: [...this.state.selectedItems] }); // Reset tempSelectedItems to selectedItems

            // Reset filters to default values
            const { filters } = this.state;
            Object.keys(filters).forEach(key => filters[key] = []);
            this.setState({ filters });
        };

        // Transaction search functions
        setSliderRelativeRangeMin = (obj) => {
            const newValue = obj.target.value;
            this.setStartAndEndDate(new Date().getTime() - newValue * 60000, new Date().getTime());
            this.setState({ sliderValueRelativeRangeMin: newValue }, () => {
                this.downloadData(); // Call downloadData after state is updated
            });
        };

        setStartAndEndDate = (start, end) => {
            this.setState({ startDate: start, endDate: end });
        };

        showModal = () =>{
            this.setState({ modalVisible: true });
        };

        handleClose= () => {
            this.setState({ modalVisible: false });
        };

        // Function to download data
        downloadData = () => {
            this.setState({ loading: true });
            const { startDate, endDate } = this.state;
        
            // Ensure the correct API endpoint is used here
            const url = `/api/transactions/search?start=${startDate}&end=${endDate}&startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`;
        
            axiosInstance.get(url)
                .then(async response => {
                    this.setState({ data: response.data, loading: false });
                    this.updateFilters(response.data);
                })
                .catch(error => {
                    //message.warning('Transactions not found.');
                    this.setState({ loading: false });
                });
        };

        // Search transactions by IDs
        searchTransactionsByIds = () => {
            const { searchMessageId, searchSenderId,searchReceiverId } = this.state;
            const url = `/api/transactions/searchbyIds?messageId=${searchMessageId}&senderId=${searchSenderId}&receiverId=${searchReceiverId}`;

            axiosInstance.get(url)
                .then(async response => {
                    this.setState({ data: response.data, loading: false });
                    this.updateFilters(response.data);
                })
                .catch(error => {
                    //message.warning('Transactions not found.');
                    this.setState({ loading: false });
                });
        };

        updateFilters = (data) => {
            const flowNames = [];
            const overallStatus = [];
            const pickupProtocols = [];
            const deliveryProtocols = [];
            const pickupNames = [];
            const deliveryNames = [];
            const pickupHosts = [];
            const deliveryHosts = [];
            const senderIds = [];
            const receiverIds = [];
            const messageIds = [];
            const messageTypes = [];
        
            data.forEach(item => {
                if (item.flowName && !flowNames.find(f => f.text === item.flowName)) {
                    flowNames.push({ text: item.flowName, value: item.flowName });
                }
                if (item.status && !overallStatus.find(s => s.text === item.status)) {
                    overallStatus.push({ text: item.status, value: item.status });
                }
                if (item.pickupProtocol && !pickupProtocols.find(p => p.text === item.pickupProtocol)) {
                    pickupProtocols.push({ text: item.pickupProtocol, value: item.pickupProtocol });
                }
                if (item.deliveryProtocol && !deliveryProtocols.find(p => p.text === item.deliveryProtocol)) {
                    deliveryProtocols.push({ text: item.deliveryProtocol, value: item.deliveryProtocol });
                }
                if (item.pickupName && !pickupNames.find(p => p.text === item.pickupName)) {
                    pickupNames.push({ text: item.pickupName, value: item.pickupName });
                }
                if (item.deliveryName && !deliveryNames.find(d => d.text === item.deliveryName)) {
                    deliveryNames.push({ text: item.deliveryName, value: item.deliveryName });
                }
                if (item.pickupHost && !pickupHosts.find(p => p.text === item.pickupHost)) {
                    pickupHosts.push({ text: item.pickupHost, value: item.pickupHost });
                }
                if (item.deliveryHost && !deliveryHosts.find(d => d.text === item.deliveryHost)) {
                    deliveryHosts.push({ text: item.deliveryHost, value: item.deliveryHost });
                }
                if (item.senderId && !senderIds.find(s => s.text === item.senderId)) {
                    senderIds.push({ text: item.senderId, value: item.senderId });
                }
                if (item.receiverId && !receiverIds.find(r => r.text === item.receiverId)) {
                    receiverIds.push({ text: item.receiverId, value: item.receiverId });
                }
                if (item.messageId && !messageIds.find(m => m.text === item.messageId)) {
                    messageIds.push({ text: item.messageId, value: item.messageId });
                }
                if (item.messageType && !messageTypes.find(m => m.text === item.messageType)) {
                    messageTypes.push({ text: item.messageType, value: item.messageType });
                }
            });
        
            this.setState({
                flowNames,
                overallStatus,
                pickupProtocols,
                deliveryProtocols,
                pickupNames,
                deliveryNames,
                pickupHosts,
                deliveryHosts,
                senderIds,
                receiverIds,
                messageIds
            }, this.updateColumnFilters);  // Call updateColumnFilters after updating filters
        };
        
        



        updateColumnFilters = () => {
            const { flowNames, overallStatus, pickupProtocols, deliveryProtocols, pickupNames, deliveryNames, pickupHosts, deliveryHosts, senderIds, receiverIds,messageIds,messageTypes } = this.state;
            
            this.columns = this.columns.map(column => {
                switch (column.key) {
                    case 'flowName':
                        return { ...column, filters: flowNames };
                    case 'status':
                        return { ...column, filters: overallStatus };
                    case 'pickupProtocol':
                        return { ...column, filters: pickupProtocols };
                    case 'deliveryProtocol':
                        return { ...column, filters: deliveryProtocols };
                    case 'pickupName':
                        return { ...column, filters: pickupNames };
                    case 'deliveryName':
                        return { ...column, filters: deliveryNames };
                    case 'pickupHost':
                        return { ...column, filters: pickupHosts };
                    case 'deliveryHost':
                        return { ...column, filters: deliveryHosts };
                    case 'senderId':
                        return { ...column, filters: senderIds };
                    case 'receiverId':
                        return { ...column, filters: receiverIds }
                    case 'messageId':
                        return { ...column, filters: messageIds }
                    case 'messageType':
                        return { ...column, filters: messageTypes }
                    default:
                        return column;
                }
            });
        };

        componentDidMount() {
            this.downloadData();
        }

        componentDidUpdate(prevProps, prevState) {
            if (prevState.startDate !== this.state.startDate) {
                this.downloadData();
            }
        }

        onChange = (pagination, filters, sorter, extra) => {
            console.log('params', pagination, filters, sorter, extra);
            this.setState({ filters });
        };

        // Function to handle download button click
        downloadMessage = async (record, type) => {
            const result = await handleDownlaod(record, type);
            this.setState({ transactionMessageDisplayContent: result });
            this.showModal();

        };

        formatSliderValue = (value) => {
            if (value > 3600) { // More than 24 hours
              const days = Math.floor(value / 3600);
              return `${days} day${days > 1 ? 's' : ''}`;
            } else if (value > 60) { // More than 1 hour
              const hours = Math.floor(value / 60);
              return `${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
              return `${value} minute${value > 1 ? 's' : ''}`;
            }
          };

        expandedRowRender = (record) => {
            // Filter child records based on parentId
            const children = this.state.data.filter(curr => record.id === curr.id);
            return (
              <Table
                columns={this.columns}
                dataSource={children}
                pagination={false} // No pagination for child rows
              />
            );
          };

        render() {
            const { loading, data, tempSelectedItems, selectedItems, sliderValueRelativeRangeMin, transactionMessageDisplayContent } = this.state;

            return (
                <>
                    <Typography.Title level={3}>Business Transactions</Typography.Title>
                    <Space direction="vertical">
                            <Text strong>Choose Fields :</Text>
                        </Space>
                    <Select
                        mode="multiple"
                        style={{ width: '100%', marginBottom: '10px' }}
                        placeholder="Please select columns to display"
                        onChange={(value) => {
                            this.setState({ tempSelectedItems: value });
                            this.handleOk();
                        }}
                        defaultValue={selectedItems}
                    >
                        {this.columns.map(column => (
                            <Select.Option key={column.key} value={column.key}>
                                {column.title}
                            </Select.Option>
                        ))}
                    </Select>
                    <div>
                        <Space direction="vertical">
                            <Text strong>Number of transactions: {data.length}</Text>
                            <Text strong>Searching transactions within {this.formatSliderValue(sliderValueRelativeRangeMin)}:</Text>
                        </Space>
                        <input
                            align="left"
                            label={sliderValueRelativeRangeMin}
                            type="range"
                            min="1"
                            max="7200"
                            value={sliderValueRelativeRangeMin}
                            className="slider"
                            id="myRange"
                            onChange={this.setSliderRelativeRangeMin}
                        />
                    </div>
                    <div>
                        <DatePicker
                            placeholder="Start Date"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={(date) => this.setStartAndEndDate(date ? date.toDate().getTime() : null, this.state.endDate)}
                        />
                        <DatePicker
                            placeholder="End Date"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={(date) => this.setStartAndEndDate(this.state.startDate, date ? date.toDate().getTime() : null)}
                        />
                        <Button type="primary" onClick={this.downloadData}>
                            Search Between Dates
                        </Button>
                    </div>
                    <div>
                        <Input
                            placeholder="Message ID"
                            onChange={(e) => this.setState({ searchMessageId: e.target.value })}
                            style={{ marginBottom: '10px', width: '25%' }}
                        />
                        <Input
                            placeholder="Sender ID"
                            onChange={(e) => this.setState({ searchSenderId: e.target.value })}
                            style={{ marginBottom: '10px', width: '25%' }}
                        />
                        <Input
                            placeholder="Receiver ID"
                            onChange={(e) => this.setState({ searchReceiverId: e.target.value })}
                            style={{ marginBottom: '10px', width: '25%' }}
                        />
                        <Button type="primary" onClick={this.searchTransactionsByIds}>
                            Search by IDs
                        </Button>
                    </div>

                    <div>
                        <Spin spinning={loading}></Spin>
                    </div>
                    <Table
                        dataSource={data}
                        columns={this.columns.filter(column => selectedItems.includes(column.key))}
                        expandable={{
                            expandedRowRender: this.expandedRowRender,
                            rowExpandable: (record) => record.id !== '', // Only allow expansion if there are children
                          }}
                        rowKey="index"
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        onChange={this.onChange}
                        rowClassName={this.rowClassName}
                    />
                    
                    <DisplayBox
                        inputData={transactionMessageDisplayContent}
                        visible={this.state.modalVisible}
                        onClose={this.handleClose}
                    />
                </>
            );
        }
    }

    export default CurrentTransactionsTable;
