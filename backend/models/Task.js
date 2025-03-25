const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  description: { type: String },
  category:  { type: String },
  completed: { type: Boolean, default: false },
  priority:  { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate:   { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
