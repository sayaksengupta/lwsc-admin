import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Button, DatePicker, Space, message, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { logsApi } from 'src/services/api';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const MedicationLogs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50, total: 0 });
  const [dateRange, setDateRange] = useState(null);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, pageSize: 50 };
      if (dateRange) {
        params.from = dateRange[0].format('YYYY-MM-DD');
        params.to = dateRange[1].format('YYYY-MM-DD');
      }
      const response = await logsApi.getMedicationLogs(params);
      const results = Array.isArray(response.data) ? response.data : (response.data.logs || response.data.data || []);
      setData(results);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.total || results.length || 0
      });
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch medication logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [dateRange]);

  const handleExport = () => {
    if (!dateRange) {
      message.warning('Please select a date range for export');
      return;
    }
    const params = {
      from: dateRange[0].format('YYYY-MM-DD'),
      to: dateRange[1].format('YYYY-MM-DD')
    };
    const url = logsApi.getExportUrl('medications', params);
    window.location.href = url;
  };

  const columns = [
    { title: 'Date', dataIndex: 'dateTime', key: 'dateTime', render: (text) => moment(text).format('YYYY-MM-DD HH:mm') },
    { 
      title: 'User', 
      key: 'user', 
      render: (_, record) => {
        const parent = record.loggedByParent;
        const isChildLog = typeof record.userId === 'string' && record.userId.startsWith('child_');

        if (isChildLog && parent) {
          const childName = parent.childProfiles?.find(c => c.childId === record.userId)?.name || 'Child Account';
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500 }}>{childName}</span>
              <span style={{ fontSize: '11px', color: '#888' }}>
                Parent: {parent.firstName} {parent.lastName}
              </span>
            </div>
          );
        }
        
        if (parent) {
           return `${parent.firstName} ${parent.lastName}`;
        }
        
        return 'Unknown User';
      }
    },
    { title: 'Medication', dataIndex: 'medicationName', key: 'medicationName', render: (text, record) => text || record.scheduleId?.name || 'Unknown' },
    { title: 'Dosage', key: 'dosage', render: (_, record) => record.scheduleId?.dose ? `${record.scheduleId.dose} ${record.scheduleId.type || ''}` : 'N/A' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
        let color = 'green';
        if (status === 'Skipped') color = 'red';
        if (status === 'Late') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
    }},
  ];

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Medication Logs</Title>
        <Space>
          <RangePicker onChange={setDateRange} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Export CSV
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={data}
        pagination={{
            ...pagination,
            onChange: (page) => fetchLogs(page)
        }}
        loading={loading}
      />
    </Card>
  );
};

export default MedicationLogs;
