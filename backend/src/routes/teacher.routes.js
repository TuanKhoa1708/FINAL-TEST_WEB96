const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacher.controller');
const validate = require('../middlewares/validationMiddleware');
const { createTeacherSchema } = require('../validators/teacher.validator');

// GET /teachers
router.get('/', teacherController.getTeachers);

// POST /teachers
router.post(
  '/',
  validate(createTeacherSchema),
  teacherController.createTeacher
);

module.exports = router;
