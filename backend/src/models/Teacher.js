const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    major: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    isGraduated: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const teacherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    teacherPositionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherPosition',
      },
    ],

    degrees: [degreeSchema],
  },
  {
    collection: 'teachers',
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);