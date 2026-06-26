const mongoose = require('mongoose');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const TeacherPosition = require('../models/TeacherPosition');
const generateTeacherCode = require('../utils/generateTeacherCode');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const USER_FIELDS = 'name email phoneNumber address identityNumber dateOfBirth';
const POSITION_FIELDS = 'code name des isActive';

const getAllTeachers = async (page, limit) => {

  
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
  };

  const total = await Teacher.countDocuments(filter);
  

  const teachers = await Teacher.find(filter)
    .populate({
      path: 'userId',
      select: USER_FIELDS,
    })
    .populate({
      path: 'teacherPositionsId',
      select: POSITION_FIELDS,
    })
    .skip(skip)
    .limit(limit)
    .lean();


  const data = teachers
    .filter((teacher) => teacher.userId)
    .map((teacher) => ({
      teacherCode: teacher.code,

      teacherName: teacher.userId.name,

      email: teacher.userId.email,

      phoneNumber: teacher.userId.phoneNumber,

      address: teacher.userId.address,

      identityNumber: teacher.userId.identityNumber,

      dateOfBirth: teacher.userId.dateOfBirth,

      status: teacher.isActive ? 'active' : 'inactive',

      teacherPositions: (teacher.teacherPositionsId || []).filter(Boolean),

      degrees: (teacher.degrees || []).map((degree) => ({
        type: degree.type || null,
        school: degree.school || null,
        major: degree.major || null,
        graduationYear: degree.year || null,
        isGraduated: degree.isGraduated,
      })),
    }));

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const createTeacher = async (body) => {
  const {
    fullName,
    email,
    phoneNumber,
    address,
    identityNumber,
    dateOfBirth,
    teacherPositions = [],
    degrees = [],
  } = body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
    isDeleted: false,
  });

  if (existingUser) {
    throw createError(400, 'Email already exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const code = await generateTeacherCode();

    const user = await User.create(
      [
        {
          name: fullName.trim(),
          email: normalizedEmail,
          phoneNumber,
          address,
          identityNumber,
          dateOfBirth,
          isDeleted: false,
        },
      ],
      { session }
    );

    const validPositions = await TeacherPosition.find({
      _id: {
        $in: teacherPositions,
      },
    })
      .select('_id')
      .session(session);

    if (validPositions.length !== teacherPositions.length) {
      throw createError(
        400,
        'One or more teacher positions do not exist'
      );
    }

    const teacherPositionsId = validPositions.map(
      (item) => item._id
    );

    const teacherDegrees = degrees.map((degree) => ({      type: degree.type || '',
      school: degree.school || '',
      major: degree.major || '',
      year: degree.graduationYear || degree.year || null,
      isGraduated:
        degree.isGraduated === undefined
          ? true
          : degree.isGraduated,
    }));

    await Teacher.create(
      [
        {
          code,
          startDate: new Date(),
          isActive: true,
          isDeleted: false,
          userId: user[0]._id,
          teacherPositionsId,
          degrees: teacherDegrees,
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  getAllTeachers,
  createTeacher,
};