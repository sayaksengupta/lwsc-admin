import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Card, Typography, Modal, Form, Input, InputNumber, Upload, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { rewardsApi, API_BASE_URL } from 'src/services/api';

const { Title } = Typography;
const { Option } = Select;

const CRITERIA_TYPES = [
  { value: 'streak', label: 'Daily Streak' },
  { value: 'total_logs', label: 'All-Time Total Logs' },
  { value: 'monthly_logs', label: 'Logs this Month' },
  { value: 'pain_logs', label: 'Total Pain Logs' },
  { value: 'medication_streak', label: 'Meds Compliance Streak' },
];

const LOG_TYPES = [
  { value: 'any', label: 'Any Category' },
  { value: 'pain', label: 'Pain Tracking Only' },
  { value: 'mood', label: 'Mood Tracking Only' },
  { value: 'hydration', label: 'Hydration Only' },
  { value: 'medication', label: 'Medication Only' },
];

const Achievements = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await rewardsApi.getAchievements();
      const results = Array.isArray(response.data) ? response.data : (response.data.achievements || response.data.data || []);
      setData(results);
    } catch (error) {
      message.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
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
      rewardCoins: record.rewardCoins,
      criteriaType: record.criteria?.type,
      criteriaValue: record.criteria?.value,
      criteriaLogType: record.criteria?.logType,
    });
    setFileList(record.icon ? [{ url: record.icon, uid: '-1', name: 'icon.png' }] : []);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('rewardCoins', values.rewardCoins);
      
      const criteria = {
        type: values.criteriaType,
        value: values.criteriaValue,
        logType: values.criteriaLogType || 'any'
      };
      formData.append('criteria', JSON.stringify(criteria));
      
      if (fileList[0]?.originFileObj) {
        formData.append('icon', fileList[0].originFileObj);
      }

      setLoading(true);
      if (editingItem) {
        await rewardsApi.updateAchievement(editingItem._id || editingItem.id, formData);
        message.success('Achievement updated successfully');
      } else {
        await rewardsApi.createAchievement(formData);
        message.success('Achievement created successfully');
      }
      setIsModalVisible(false);
      fetchAchievements();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save achievement');
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
      title: 'Coins',
      dataIndex: 'rewardCoins',
      key: 'rewardCoins',
      render: (coins) => <Tag color="gold">{coins} Coins</Tag>
    },
    {
      title: 'Criteria',
      key: 'criteria',
      render: (_, record) => {
        const type = CRITERIA_TYPES.find(t => t.value === record.criteria?.type)?.label || record.criteria?.type;
        const logType = LOG_TYPES.find(t => t.value === record.criteria?.logType)?.label;
        return (
          <Space direction="vertical" size="small">
            <Tag color="blue">{type}: {record.criteria?.value}</Tag>
            {logType && <small className="text-muted">({logType})</small>}
          </Space>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Achievements Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Achievement
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record._id || record.id}
        dataSource={data}
        loading={loading}
      />

      <Modal
        title={editingItem ? 'Edit Achievement' : 'Add Achievement'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="rewardCoins" label="Reward Coins" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Title level={5}>Criteria</Title>
          <Space align='start' style={{ width: '100%', display: 'flex' }}>
            <Form.Item 
              name="criteriaType" 
              label="Type" 
              rules={[{ required: true }]} 
              style={{ flex: 1 }}
              tooltip="What behavior triggers this reward? e.g., 'Daily Streak' for consecutive logs."
            >
              <Select placeholder="Select Type">
                {CRITERIA_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item 
              name="criteriaValue" 
              label="Target Value" 
              rules={[{ required: true }]} 
              style={{ flex: 1 }}
              tooltip="The numerical goal to reach. e.g., '7' for a 7-day streak."
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item 
              name="criteriaLogType" 
              label="Log Type" 
              style={{ flex: 1 }}
              tooltip="Optional: Restrict to a specific category like 'Pain' or 'Medication'."
            >
              <Select placeholder="Select Category">
                {LOG_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

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

export default Achievements;
