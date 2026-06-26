import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TeacherList from '../pages/teachers/TeacherList';
import TeacherPositionList from '../pages/teacherPositions/TeacherPositionList';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* Default redirect to /teachers */}
      <Route index element={<Navigate to="/teachers" replace />} />
      <Route path="teachers" element={<TeacherList />} />
      <Route path="teacher-positions" element={<TeacherPositionList />} />
      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/teachers" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
