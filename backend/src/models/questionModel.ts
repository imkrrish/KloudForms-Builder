import mongoose from 'mongoose';
import { IQuestion } from '../types';

const QuestionSchema = new mongoose.Schema(
  {
    categorizeQuestion: {
      question: String,
      categories: [String],
      categorizeQuestionImage: String,
      items: [
        new mongoose.Schema(
          {
            name: String,
            category: String,
          },
          { _id: false }
        ),
      ],
    },

    clozeQuestion: {
      passage: String,
      clozeQuestionImage: String,
      blanks: [
        new mongoose.Schema(
          {
            name: String,
            correct_answer: String,
          },
          { _id: false }
        ),
      ],
      options: [String],
    },

    comprehensionQuestion: {
      passage: String,
      comprehensionQuestionImage: String,
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
