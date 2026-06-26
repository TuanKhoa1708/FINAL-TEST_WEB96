import { Spin } from 'antd';

const Loading = ({ tip = 'Loading...' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
    <Spin size="large" tip={tip} />
  </div>
);

export default Loading;
