import { Document, Types } from 'mongoose';

// Define an interface for a Form
export interface IForm extends Document {
  title: string;
  headerImage?: string;
  questions: Types.ObjectId | IQuestion;
}

// Define an interface for a Question document
export interface IQuestion extends Document {
  categorizeQuestion?: {
    question: string;
    categorizeQuestionImage?: string;
    categories: string[];
    items: {
      name: string;
      category: string;
    }[];
  };

  clozeQuestion?: {
    passage: string;
    clozeQuestionImage?: string;
    blanks: {
      name: string;
      correct_answer: string;
    }[];
    options: string[];
  };

  comprehensionQuestion?: {
    passage: string;
    comprehensionQuestionImage?: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: string;
    }[];
  };
}

// Define an interface for a User Response
export interface IUserResponse extends Document {
  form: Types.ObjectId; // Reference to the Form for which the user is responding
  responses: {
    question: Types.ObjectId;
    response: any;
  }[];
}