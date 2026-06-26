import { Empty as AntEmpty } from 'antd';

const Empty = ({ description = 'No data found' }) => (
  <div style={{ padding: '60px 0', textAlign: 'center' }}>
    <AntEmpty description={description} />
  </div>
);

export default Empty;
