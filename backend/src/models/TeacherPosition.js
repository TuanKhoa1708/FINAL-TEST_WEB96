const mongoose = require('mongoose');

const teacherPositionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    des: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'teacherpositions',
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  'TeacherPosition',
  teacherPositionSchema
);