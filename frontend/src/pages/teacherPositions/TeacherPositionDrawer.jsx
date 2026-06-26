import { useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Switch,
  Button,
  Space,
  Typography,
  message,
} from 'antd';
import { createTeacherPosition } from '../../services/teacherPosition.service';

const { Text } = Typography;

const TeacherPositionDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createTeacherPosition(values);
      messageApi.success('Teacher position created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      messageApi.error(error.message || 'Failed to create teacher position');
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <Space direction="vertical" size={0}>
            <span>Create Teacher Position</span>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              Fill in the details below to add a new position.
            </Text>
          </Space>
        }
        open={open}
        onClose={onClose}
        width={480}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Create
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please enter a position code' }]}
          >
            <Input placeholder="e.g. TP001" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a position name' }]}
          >
            <Input placeholder="e.g. Math Teacher" />
          </Form.Item>

          <Form.Item label="Description" name="des">
            <Input.TextArea
              placeholder="Short description of this position..."
              rows={3}
            />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default TeacherPositionDrawer;
