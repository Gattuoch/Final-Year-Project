import mongoose from 'mongoose';

const reportScheduleSchema = new mongoose.Schema({
  reportTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReportTemplate',
    required: true,
  },
  recipients: [{
    type: String,
    required: true,
  }],
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    required: true,
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv'],
    default: 'pdf',
  },
  nextRun: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Paused'],
    default: 'Active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.models.ReportSchedule || mongoose.model('ReportSchedule', reportScheduleSchema);
