import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Modal, Form, Input, DatePicker, Select, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { articleApi, API_BASE_URL } from 'src/services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const Articles = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchArticles = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await articleApi.getArticles({ page, pageSize });
      setData(response.data.data || []);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      message.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
        publishedAt: dayjs(),
        source: 'internal'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      publishedAt: dayjs(record.publishedAt),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await articleApi.deleteArticle(id);
      message.success('Article deleted successfully');
      fetchArticles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete article');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        publishedAt: values.publishedAt.toISOString()
      };

      setLoading(true);
      if (editingItem) {
        await articleApi.updateArticle(editingItem._id, payload);
        message.success('Article updated successfully');
      } else {
        await articleApi.createArticle(payload);
        message.success('Article created successfully');
      }
      setIsModalVisible(false);
      fetchArticles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => url ? (
        <img src={url} alt="article" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
      ) : <Tag>No Image</Tag>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source) => (
        <Tag color={source === 'internal' ? 'blue' : 'green'}>
          {source.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Published At',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<LinkOutlined />} 
            onClick={() => window.open(record.url, '_blank')} 
            title="View Article"
          />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this article?"
            onConfirm={() => handleDelete(record._id)}
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
        <Title level={4} style={{ margin: 0 }}>Education Articles</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Article
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />

      <Modal
        title={editingItem ? 'Edit Article' : 'Add Article'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Enter article title" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Excerpt / Description"
          >
            <Input.TextArea rows={3} placeholder="Brief summary of the article" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Article URL"
            rules={[{ required: true, message: 'Please input the article URL!' }]}
          >
            <Input placeholder="https://example.com/article" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
                name="source"
                label="Source"
                initialValue="internal"
                style={{ flex: 1 }}
            >
                <Select>
                    <Option value="internal">Internal</Option>
                    <Option value="rss">RSS/External</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="publishedAt"
                label="Published Date"
                rules={[{ required: true }]}
                style={{ flex: 1 }}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default Articles;
