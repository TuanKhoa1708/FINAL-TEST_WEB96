const teacherService = require('../services/teacher.service');
const asyncHandler = require('../middlewares/asyncHandler');

const getTeachers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));

  const result = await teacherService.getAllTeachers(page, limit);

  return res.status(200).json({
    success: true,
    data: result.data,
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const createTeacher = asyncHandler(async (req, res) => {
  await teacherService.createTeacher(req.body);

  return res.status(201).json({
    success: true,
    message: 'Teacher created successfully',
  });
});

module.exports = {
  getTeachers,
  createTeacher,
};
