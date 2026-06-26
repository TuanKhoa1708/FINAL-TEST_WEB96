import { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Card,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { createTeacher } from '../../services/teacher.service';
import { getTeacherPositions } from '../../services/teacherPosition.service';

const { Text, Title } = Typography;

const DEGREE_TYPES = ['Bachelor', 'Master', 'Doctor', 'Associate', 'Diploma', 'Other'];

const emptyDegree = () => ({
  id: Date.now(),
  type: '',
  school: '',
  major: '',
  graduationYear: null,
});

const TeacherDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [degrees, setDegrees] = useState([emptyDegree()]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setDegrees([emptyDegree()]);
      fetchPositions();
    }
  }, [open, form]);

  const fetchPositions = async () => {
    setLoadingPositions(true);
    try {
      const res = await getTeacherPositions();
      setPositions(res.data ?? []);
    } catch {

    } finally {
      setLoadingPositions(false);
    }
  };

  const addDegree = () => setDegrees((prev) => [...prev, emptyDegree()]);

  const removeDegree = (id) =>
    setDegrees((prev) => prev.filter((d) => d.id !== id));

  const updateDegree = (id, field, value) =>
    setDegrees((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const cleanDegrees = degrees
        .filter((d) => d.type || d.school)
        .map(({ id, ...rest }) => ({
          ...rest,
          graduationYear: rest.graduationYear ? Number(rest.graduationYear) : undefined,
        }));

      const payload = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        identityNumber: values.identityNumber,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format('YYYY-MM-DD')
          : undefined,
        status: values.status ?? 'active',
        teacherPositions: values.teacherPositions ?? [],
        degrees: cleanDegrees,
      };

      await createTeacher(payload);
      messageApi.success('Teacher created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      messageApi.error(error.message || 'Failed to create teacher');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <Space direction="vertical" size={0}>
            <span>Create Teacher</span>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              Fill in all required fields to register a new teacher.
            </Text>
          </Space>
        }
        open={open}
        onClose={onClose}
        width={600}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Create Teacher
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: '#1677ff' }}>
            Personal Information
          </Title>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Full name is required' }]}
              >
                <Input placeholder="e.g. John Smith" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email address' },
                ]}
              >
                <Input placeholder="john@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  {
                    pattern: /^[0-9]{9,15}$/,
                    message: 'Phone must be 9–15 digits',
                  },
                ]}
              >
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Address" name="address">
            <Input placeholder="Street, City, Country" />
          </Form.Item>

          <Divider />

          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: '#1677ff' }}>
            Teacher Details
          </Title>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Identity Number"
                name="identityNumber"
                rules={[
                  {
                    pattern: /^[0-9]{9,12}$/,
                    message: 'Identity number must be 9–12 digits',
                  },
                ]}
              >
                <Input placeholder="9–12 digit ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date of Birth" name="dateOfBirth">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status" name="status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Teacher Positions" name="teacherPositions">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select one or more positions..."
              loading={loadingPositions}
              options={positions.map((p) => ({
                value: p._id,
                label: `${p.name} (${p.code})`,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0, color: '#1677ff' }}>
              Degrees
            </Title>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={addDegree}
              type="dashed"
            >
              Add Degree
            </Button>
          </div>

          {degrees.map((degree, index) => (
            <Card
              key={degree.id}
              size="small"
              style={{ marginBottom: 12, background: '#fafafa' }}
              extra={
                degrees.length > 1 && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeDegree(degree.id)}
                  />
                )
              }
              title={<Text type="secondary" style={{ fontSize: 12 }}>Degree {index + 1}</Text>}
            >
              <Row gutter={12}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12 }}>Type</Text>
                    <Select
                      style={{ width: '100%', marginTop: 4 }}
                      placeholder="Select type"
                      value={degree.type || undefined}
                      onChange={(val) => updateDegree(degree.id, 'type', val)}
                      options={DEGREE_TYPES.map((t) => ({ value: t, label: t }))}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12 }}>Graduation Year</Text>
                    <Input
                      style={{ marginTop: 4 }}
                      placeholder="e.g. 2015"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={degree.graduationYear ?? ''}
                      onChange={(e) =>
                        updateDegree(degree.id, 'graduationYear', e.target.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <div>
                    <Text style={{ fontSize: 12 }}>School</Text>
                    <Input
                      style={{ marginTop: 4 }}
                      placeholder="University / College name"
                      value={degree.school}
                      onChange={(e) =>
                        updateDegree(degree.id, 'school', e.target.value)
                      }
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text style={{ fontSize: 12 }}>Major</Text>
                    <Input
                      style={{ marginTop: 4 }}
                      placeholder="e.g. Computer Science"
                      value={degree.major}
                      onChange={(e) =>
                        updateDegree(degree.id, 'major', e.target.value)
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Form>
      </Drawer>
    </>
  );
};

export default TeacherDrawer;
