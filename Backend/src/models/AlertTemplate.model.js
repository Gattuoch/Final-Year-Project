import mongoose from 'mongoose';

const alertTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a template title'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please add a template message'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('AlertTemplate', alertTemplateSchema);
