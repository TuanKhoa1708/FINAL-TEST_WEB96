import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Alert,
  Tooltip,
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getTeacherPositions } from '../../services/teacherPosition.service';
import TeacherPositionDrawer from './TeacherPositionDrawer';

const { Title } = Typography;

const TeacherPositionList = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherPositions();
      setPositions(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'des',
      key: 'des',
      render: (des) => des || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) =>
        isActive !== false ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
  ];

  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0 }}>
          Teacher Positions
        </Title>
      }
      extra={
        <Space>
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={fetchPositions} loading={loading} />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Create Position
          </Button>
        </Space>
      }
      bodyStyle={{ padding: 0 }}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ margin: 16 }}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={positions}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: 'No teacher positions found' }}
        style={{ borderRadius: 0 }}
      />

      <TeacherPositionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={fetchPositions}
      />
    </Card>
  );
};

export default TeacherPositionList;
