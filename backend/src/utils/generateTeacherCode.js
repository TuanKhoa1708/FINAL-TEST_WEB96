const Teacher = require('../models/Teacher');

const generateRandomCode = () => {
  return Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
};

const generateTeacherCode = async () => {
  const MAX_RETRIES = 50;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    const code = generateRandomCode();
    const exists = await Teacher.findOne({ code });

    if (!exists) {
      return code;
    }

    attempts++;
  }

  throw new Error('Failed to generate a unique teacher code after multiple attempts');
};

module.exports = generateTeacherCode;