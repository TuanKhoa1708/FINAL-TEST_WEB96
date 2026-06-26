const express = require('express');
const router = express.Router();

const teacherPositionController = require('../controllers/teacherPosition.controller');
const validate = require('../middlewares/validationMiddleware');
const { createTeacherPositionSchema } = require('../validators/teacherPosition.validator');

router.get('/', teacherPositionController.getTeacherPositions);

router.post(
  '/',
  validate(createTeacherPositionSchema),
  teacherPositionController.createTeacherPosition
);

module.exports = router;
