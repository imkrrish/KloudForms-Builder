import mongoose, { Document, Schema } from 'mongoose';
import { IUserResponse } from '../types';

// Create a schema for individual responses with timestamps
const responseSchema: Schema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    response: Schema.Types.Mixed,
  },
  {
    timestamps: true, // Enable timestamps for individual responses
  }
);

// Create a schema for User Responses
const userResponseSchema: Schema = new Schema({
  form: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  responses: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      response: [responseSchema],
    },
  ],
});

// Create a model for User Responses
export default mongoose.model<IUserResponse>('UserResponse', userResponseSchema);
