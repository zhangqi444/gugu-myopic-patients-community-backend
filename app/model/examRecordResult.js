'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { TYPE } = require('../constant/examRecord');
  const Schema = mongoose.Schema;

  const ExamRecordResultSchema = new Schema({

    result: { type: Schema.Types.Object, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: false },
    recordedAt: { type: Date, default: Date.now },

    screenshots: [ String ],
    note: { type: String },

    examRecord: { type: Schema.Types.ObjectId, ref: 'ExamRecord', autopopulate: true },

    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

  });

  ExamRecordResultSchema.index({ recordedAt: -1, user: 1 });
  ExamRecordResultSchema.plugin(require('mongoose-autopopulate'));
  return mongoose.model('ExamRecordResult', ExamRecordResultSchema);
};
