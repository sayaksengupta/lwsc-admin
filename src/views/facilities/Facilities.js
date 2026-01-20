import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Typography, Modal, Form, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { facilityApi } from 'src/services/api';

const { Title } = Typography;
const { Option } = Select;

const Facilities = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchFacilities = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await facilityApi.getFacilities({ page, pageSize });
      setData(response.data.data || []);
      setTotal(response.data.meta?.total || 0);
    } catch (error) {
      message.error('Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      lng: record.location?.coordinates[0],
      lat: record.location?.coordinates[1],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await facilityApi.deleteFacility(id);
      message.success('Facility deleted successfully');
      fetchFacilities(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete facility');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        coordinates: [parseFloat(values.lng), parseFloat(values.lat)]
      };

      setLoading(true);
      if (editingItem) {
        await facilityApi.updateFacility(editingItem._id, payload);
        message.success('Facility updated successfully');
      } else {
        await facilityApi.createFacility(payload);
        message.success('Facility created successfully');
      }
      setIsModalVisible(false);
      fetchFacilities(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save facility');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this facility?"
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
        <Title level={4} style={{ margin: 0 }}>Facilities & Centers</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Facility
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
        title={editingItem ? 'Edit Facility' : 'Add Facility'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Facility Name"
                rules={[{ required: true, message: 'Please input the facility name!' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Hope Sickle Cell Center" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Facility Type"
                rules={[{ required: true, message: 'Please select a type!' }]}
              >
                <Select placeholder="Select type">
                  <Option value="Hospital">Hospital</Option>
                  <Option value="Clinic">Clinic</Option>
                  <Option value="Pharmacy">Pharmacy</Option>
                  <Option value="Lab">Lab</Option>
                  <Option value="Center">Center</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Brief description of the facility" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="mobile" label="Mobile">
                <Input placeholder="+1-xxx-xxx-xxxx" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                <Input placeholder="hope@center.org" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Full Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Input placeholder="e.g. Texas" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <Input placeholder="e.g. USA" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="zipcode" label="Zipcode">
                <Input placeholder="XXXXX" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Coordinates</Title>
          <p style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '8px' }}>
            Note: You can fetch these from Google Maps by right-clicking a location.
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lat"
                label="Latitude"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" step="0.000001" placeholder="e.g. 29.7604" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lng"
                label="Longitude"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" step="0.000001" placeholder="e.g. -95.3698" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default Facilities;
