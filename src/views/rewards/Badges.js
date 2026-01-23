import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Modal, Form, Input, InputNumber, Upload, Tag } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { rewardsApi, API_BASE_URL } from 'src/services/api';

const { Title } = Typography;

const Badges = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await rewardsApi.getBadges();
      const results = Array.isArray(response.data) ? response.data : (response.data.badges || response.data.data || []);
      setData(results);
    } catch (error) {
      message.error('Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      coinCost: record.coinCost,
    });
    setFileList(record.icon ? [{ url: record.icon, uid: '-1', name: 'icon.png' }] : []);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await rewardsApi.deleteBadge(id);
      message.success('Badge deleted successfully');
      fetchBadges();
    } catch (error) {
      message.error('Failed to delete badge');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('coinCost', values.coinCost);
      
      if (fileList[0]) {
        if (fileList[0].originFileObj) {
          formData.append('icon', fileList[0].originFileObj);
        } else if (fileList[0] instanceof File) {
          formData.append('icon', fileList[0]);
        }
      }

      setLoading(true);
      if (editingItem) {
        await rewardsApi.updateBadge(editingItem._id || editingItem.id, formData);
        message.success('Badge updated successfully');
      } else {
        await rewardsApi.createBadge(formData);
        message.success('Badge created successfully');
      }
      setIsModalVisible(false);
      fetchBadges();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save badge');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => {
        if (!icon) return 'No Icon';
        const src = icon.startsWith('http') ? icon : `${API_BASE_URL}${icon}`;
        return <img src={src} alt="icon" style={{ width: 40, height: 40, objectFit: 'contain' }} />;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Cost',
      dataIndex: 'coinCost',
      key: 'coinCost',
      render: (cost) => <Tag color="gold">{cost} Coins</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this badge?"
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
        <Title level={4} style={{ margin: 0 }}>Badges Management</Title>
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAdd}>
          Add Badge
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record._id || record.id}
        dataSource={data}
        loading={loading}
      />

      <Modal
        title={editingItem ? 'Edit Badge' : 'Add Badge'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="coinCost" label="Coin Cost" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Icon">
            <Upload 
              beforeUpload={(file) => { setFileList([file]); return false; }} 
              fileList={fileList}
              onRemove={() => setFileList([])}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Icon</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Badges;
