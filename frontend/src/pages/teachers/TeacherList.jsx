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
import dayjs from 'dayjs';
import { getTeachers } from '../../services/teacher.service';
import TeacherDrawer from './TeacherDrawer';

const { Title } = Typography;

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTeachers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeachers(page, limit);
      setTeachers(res.data ?? []);
      setPagination((prev) => ({
        ...prev,
        current: res.page ?? page,
        pageSize: res.limit ?? limit,
        total: res.total ?? 0,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers(1, 10);
  }, [fetchTeachers]);

  const handleTableChange = (pag) => {
    fetchTeachers(pag.current, pag.pageSize);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Teacher Code',
      dataIndex: 'teacherCode',
      key: 'teacherCode',
      render: (code) => (
        <Tag color="geekblue" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (name) => name || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone) => phone || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Identity No.',
      dataIndex: 'identityNumber',
      key: 'identityNumber',
      render: (id) => id || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dob) =>
        dob ? dayjs(dob).format('DD/MM/YYYY') : <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'active' ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="warning">Inactive</Tag>
        ),
    },
    {
      title: 'Positions',
      dataIndex: 'teacherPositions',
      key: 'teacherPositions',
      render: (positions) =>
        positions?.length ? (
          <Space size={4} wrap>
            {positions.map((p) => (
              <Tag key={p._id} color="purple">
                {p.name}
              </Tag>
            ))}
          </Space>
        ) : (
          <span style={{ color: '#bbb' }}>None</span>
        ),
    },
    {
      title: 'Degrees',
      dataIndex: 'degrees',
      key: 'degrees',
      render: (degrees) =>
        degrees?.length ? (
          <Space size={4} wrap>
            {degrees.map((d, i) => (
              <Tooltip
                key={i}
                title={`${d.school}${d.major ? ' · ' + d.major : ''}${
                  d.graduationYear ? ' (' + d.graduationYear + ')' : ''
                }`}
              >
                <Tag color="cyan">{d.type}</Tag>
              </Tooltip>
            ))}
          </Space>
        ) : (
          <span style={{ color: '#bbb' }}>None</span>
        ),
    },
  ];

  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0 }}>
          Teachers
        </Title>
      }
      extra={
        <Space>
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={() => fetchTeachers(1, pagination.pageSize)} loading={loading} />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Create Teacher
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
        rowKey="teacherCode"
        columns={columns}
        dataSource={teachers}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} teachers`,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
        locale={{ emptyText: 'No teachers found' }}
        style={{ borderRadius: 0 }}
      />

      <TeacherDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => fetchTeachers(1, pagination.pageSize)}
      />
    </Card>
  );
};

export default TeacherList;
