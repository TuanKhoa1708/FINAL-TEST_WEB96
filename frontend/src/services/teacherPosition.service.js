import api from './axios';

/**
 * GET /teacher-positions
 * Returns all non-deleted positions.
 */
export const getTeacherPositions = () => api.get('/teacher-positions');

/**
 * POST /teacher-positions
 * Body: { code, name, des?, isActive? }
 */
export const createTeacherPosition = (data) =>
  api.post('/teacher-positions', data);
