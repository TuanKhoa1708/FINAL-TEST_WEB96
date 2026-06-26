import api from './axios';

/**
 * GET /teachers
 * Returns paginated teacher list.
 */
export const getTeachers = (page = 1, limit = 10) =>
  api.get('/teachers', { params: { page, limit } });

/**
 * POST /teachers
 * Creates User + Teacher in one call.
 * Backend requires: fullName, email (for User), plus teacher fields.
 */
export const createTeacher = (data) => api.post('/teachers', data);
