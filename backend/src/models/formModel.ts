import mongoose, { Schema } from 'mongoose';
import { IForm } from '../types';

// Create a schema for Forms
const formSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    headerImage: { type: String },
    questions: { type: Schema.Types.ObjectId, ref: 'Question' },
  },
  { timestamps: true }
);

export default mongoose.model<IForm>('Form', formSchema);
