import mongoose from 'mongoose';

const sharedReportSchema = new mongoose.Schema({
  reportTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReportTemplate',
    required: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.models.SharedReport || mongoose.model('SharedReport', sharedReportSchema);
