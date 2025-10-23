import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: 'Product' | 'Service' | 'Support';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  dateSubmitted: Date;
}

const ComplaintSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    maxlength: [1000, 'Description cannot be more than 1000 characters.'],
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
    enum: ['Product', 'Service', 'Support'],
  },
  priority: {
    type: String,
    required: [true, 'Priority is required.'],
    enum: ['Low', 'Medium', 'High'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;