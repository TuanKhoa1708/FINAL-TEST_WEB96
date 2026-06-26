const TeacherPosition = require('../models/TeacherPosition');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};


const getAllTeacherPositions = async () => {
  const positions = await TeacherPosition.find({ isDeleted: false }).lean();
  return positions;
};


const createTeacherPosition = async (body) => {
  const { code, name, des, isActive = true } = body;

  const existing = await TeacherPosition.findOne({ code: code.trim(), isDeleted: false });
  if (existing) {
    throw createError(400, `Teacher position code '${code}' already exists`);
  }

  await TeacherPosition.create({ code: code.trim(), name: name.trim(), des, isActive });
};

module.exports = {
  getAllTeacherPositions,
  createTeacherPosition,
};
