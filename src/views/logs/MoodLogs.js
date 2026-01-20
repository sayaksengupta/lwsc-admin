import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Button, DatePicker, Space, message, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { logsApi } from 'src/services/api';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const MoodLogs = () => {
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
      const response = await logsApi.getMoodLogs(params);
      const results = Array.isArray(response.data) ? response.data : (response.data.logs || response.data.data || []);
      setData(results);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.total || results.length || 0
      });
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch mood logs');
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
    const url = logsApi.getExportUrl('mood', params);
    window.location.href = url;
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: (text) => moment(text).format('YYYY-MM-DD HH:mm') },
    { 
      title: 'User', 
      key: 'user', 
      render: (_, record) => {
        const parent = record.loggedByParent;
        const isChildLog = typeof record.userId === 'string' && record.userId.startsWith('child_');

        if (isChildLog && parent) {
          // Try to find child name from parent's profiles if available
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
        
        // Parent or direct user log
        if (parent) {
           return `${parent.firstName} ${parent.lastName}`;
        }
        
        // Fallback if no parent info (e.g. legacy or deleted)
        return 'Unknown User';
      }
    },
    { title: 'Mood', dataIndex: 'emoji', key: 'emoji', render: (emoji) => <span style={{ fontSize: '20px' }}>{emoji}</span> },
    { title: 'Intensity', dataIndex: 'intensity', key: 'intensity', render: (val) => <Tag color={val > 7 ? 'red' : val > 4 ? 'orange' : 'green'}>{val}/10</Tag> },
    { title: 'Note', dataIndex: 'desc', key: 'desc', ellipsis: true },
  ];

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Mood Logs</Title>
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

export default MoodLogs;
