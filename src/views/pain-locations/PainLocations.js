import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Modal, Form, Input, Switch, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { painLocationApi, API_BASE_URL } from 'src/services/api';

const { Title } = Typography;

const PainLocations = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await painLocationApi.getLocations();
      const results = Array.isArray(response.data) ? response.data : (response.data.locations || response.data.data || []);
      setData(results);
    } catch (error) {
      message.error('Failed to fetch pain locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
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
      name: record.name,
      isActive: record.isActive,
    });
    setFileList(record.logo ? [{ url: record.logo, uid: '-1', name: 'logo.png' }] : []);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await painLocationApi.deleteLocation(id);
      message.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      message.error('Failed to delete location');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('isActive', values.isActive);
      
      if (fileList[0]?.originFileObj) {
        formData.append('logo', fileList[0].originFileObj);
      }

      setLoading(true);
      if (editingItem) {
        await painLocationApi.updateLocation(editingItem._id || editingItem.id, formData);
        message.success('Location updated successfully');
      } else {
        await painLocationApi.createLocation(formData);
        message.success('Location created successfully');
      }
      setIsModalVisible(false);
      fetchLocations();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => {
        if (!logo) return 'No Logo';
        const src = logo.startsWith('http') ? logo : `${API_BASE_URL}${logo}`;
        return <img src={src} alt="logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this location?"
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

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Pain Locations</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Location
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record._id || record.id}
        dataSource={data}
        loading={loading}
      />

      <Modal
        title={editingItem ? 'Edit Location' : 'Add Location'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
          <Form.Item
            name="name"
            label="Location Name"
            rules={[{ required: true, message: 'Please input the location name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Logo">
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PainLocations;
