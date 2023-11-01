import formModel from '../models/formModel';
import questionModel from '../models/questionModel';
import formResponseModel from '../models/formResponseModel';
import { IForm } from '../types';
import BaseRepo from './baseRepository';
import { error } from 'console';

export default class FormRepo extends BaseRepo {
  async createNewFrom(data: IForm) {
    let savedQuestions = await questionModel
      .create(data.questions)
      .catch((error) => error)
      .then((res) => res._id);

    let formData = {
      title: data.title,
      questions: savedQuestions,
      headerImage: data.headerImage,
    };

    return await formModel.create(formData);
  }

  async getAllForms() {
    let getAllForms = await formModel.find({}, 'id title');
    let count = getAllForms.length;

    return { getAllForms, count };
  }

  async getFormById(id: any) {
    return (await formModel.findById(id)).populate('questions');
  }

  async updateForm(id: any, data: IForm) {
    return await formModel.findByIdAndUpdate(id, data);
  }

  async deleteForm(id: any, questionsId: any) {
    // Delete associated questions and user responses
    await questionModel.findByIdAndDelete(questionsId).catch((e) => {
      console.log(e);
    });
    // await formResponseModel.deleteMany({ form: id });
    // Delete the form by its ID
    return await formModel.findByIdAndDelete(id);
  }
}
