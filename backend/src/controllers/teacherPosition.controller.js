const teacherPositionService = require('../services/teacherPosition.service');
const asyncHandler = require('../middlewares/asyncHandler');

const getTeacherPositions = asyncHandler(async (req, res) => {
  const positions = await teacherPositionService.getAllTeacherPositions();

  return res.status(200).json({
    success: true,
    data: positions,
  });
});

const createTeacherPosition = asyncHandler(async (req, res) => {
  await teacherPositionService.createTeacherPosition(req.body);

  return res.status(201).json({
    success: true,
    message: 'Teacher Position created successfully',
  });
});

module.exports = {
  getTeacherPositions,
  createTeacherPosition,
};
