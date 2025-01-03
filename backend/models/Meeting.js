const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  client: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  info: { type: String, required: true },
  location: { type: String, required: true },
  lawyer: { type: String, required: true }, 
});


const Meeting = mongoose.model('Meeting', meetingSchema, 'meetings');
module.exports = Meeting;
