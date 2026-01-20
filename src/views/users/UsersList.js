import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Space, Popconfirm, message, Card, Typography, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { userApi } from 'src/services/api';
import moment from 'moment';

const { Title } = Typography;

const UsersList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');

  const fetchUsers = useCallback(async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ page, pageSize, search });
      const results = Array.isArray(response.data) ? response.data : (response.data.users || response.data.data || []);
      setData(results);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.meta?.total || response.data.total || results.length || 0,
      });
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchUsers(newPagination.current, newPagination.pageSize, searchText);
  };

  const onSearch = (value) => {
    setSearchText(value);
    fetchUsers(1, pagination.pageSize, value);
  };

  const handleDelete = async (id) => {
    try {
      await userApi.deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>{record.firstName} {record.lastName}</span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD MMM YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => message.info('View details feature coming soon')}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>User Management</Title>
        <Input.Search
          placeholder="Search by name or email"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record._id || record.id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default UsersList;
