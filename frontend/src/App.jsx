import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

const App = () => (
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <AppRoutes />
    </ConfigProvider>
  </BrowserRouter>
);

export default App;
