
require('dotenv').config();
const mongoose = require('mongoose');

const Teacher = require('../models/Teacher');
const TeacherPosition = require('../models/TeacherPosition');

const run = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌  MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅  MongoDB connected:', mongoose.connection.name);

  const teacherResult = await Teacher.updateMany(
    { isDeleted: { $ne: false } },   // chỉ cập nhật doc chưa đúng
    { $set: { isDeleted: false } }
  );
  console.log(
    `✅  teachers: ${teacherResult.modifiedCount} document(s) updated → isDeleted: false`
  );

  const positionResult = await TeacherPosition.updateMany(
    { isDeleted: { $ne: false } },
    { $set: { isDeleted: false } }
  );
  console.log(
    `✅  teacherpositions: ${positionResult.modifiedCount} document(s) updated → isDeleted: false`
  );

  await mongoose.disconnect();
  console.log('🎉  Seed completed. Database disconnected.');
};

run().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
