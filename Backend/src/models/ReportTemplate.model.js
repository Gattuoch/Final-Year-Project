import mongoose from 'mongoose';

const reportTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a report name'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please add a report type'],
    enum: ['System Performance', 'Financial', 'Analytics', 'Security'],
  },
  defaultSchedule: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'On-demand'],
    default: 'On-demand',
  },
  lastRun: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.models.ReportTemplate || mongoose.model('ReportTemplate', reportTemplateSchema);
