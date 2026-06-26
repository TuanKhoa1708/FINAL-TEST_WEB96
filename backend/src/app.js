const express = require('express');
const cors = require('cors');

const teacherRoutes = require('./routes/teacher.routes');
const teacherPositionRoutes = require('./routes/teacherPosition.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Teacher Management System API is running',
  });
});

app.use('/teachers', teacherRoutes);
app.use('/teacher-positions', teacherPositionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
