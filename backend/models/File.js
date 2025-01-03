const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  caseId: { type: String, required: true },
  lawyer: { type: String, required: true },
  caseTitle: { type: String, required: true },
  openDate: { type: Date, required: true },
  status: { type: String, enum: ['פתוח', 'סגור', 'בערעור'], required: true },
  caseType: { type: String, required: true },
  plaintiff: { type: String, required: true },
  defendant: { type: String, required: true },
  courtName: { type: String, required: true },
  judges: { type: [String], required: true },
  attorneys: {
    plaintiff: { type: String, required: true },
    defendant: { type: String, required: true },
  },
  importantDates: [
    {
      event: { type: String, required: true },
      date: { type: Date, required: true },
      missions: {
        type: [
          {
            text: { type: String, required: true },
            completed: { type: Boolean, default: false },
          },
        ],
        default: [],
      },
    },
  ],
  finalDecision: { type: String, default: null },
  costs: { type: Number, default: null },
  payed: { type: Number, default: 0 },
  files: [
    {
      fileName: { type: String, required: true },
      fileSize: { type: Number, required: true },
      dropboxPath: { type: String, required: true },
      dropboxId: { type: String, required: true }, 
      uploadDate: { type: Date, default: Date.now }, 
    },
  ]
});

const File = mongoose.model('File', fileSchema, 'files');

module.exports = File;