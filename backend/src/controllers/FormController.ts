import { Response, Request } from 'express';
import FormRepo from '../repositories/formRepository';
import { IForm, IQuestion } from '../types';
import Logger from '../utils/winston.utils';
import BaseController from './baseController';
import Status from '../utils/status-codes-messages.utils';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import config from '../config/firebase.config';

initializeApp(config.firebaseConfig);

class FormController extends BaseController {
  formRepo = new FormRepo();
  storage = getStorage();
  upload = multer({ storage: multer.memoryStorage() });

  async uploadImageToFirebase(imageFile: any): Promise<string | null> {
    let dateTime = this.giveCurrentDateTime();

    if (!imageFile) {
      return null;
    }

    const imageFileName = `${dateTime}_${imageFile.name}`;

    const storageRef = ref(this.storage, 'images/' + imageFileName);

    try {
      const uploadTask = uploadBytesResumable(storageRef, imageFile.data);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => {
            console.error('Image upload error:', error);
            reject(error);
          },
          resolve
        );
      });
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded successfully.');
      return downloadURL;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  async deleteImageFromFirebase(imageUrl: string): Promise<void> {
    try {
      let cleanedPath = this.extractPathFromImageUrl(imageUrl);
      const imageRef = ref(this.storage, cleanedPath);
      // Delete the image
      await deleteObject(imageRef);

      console.log('Image deleted successfully.');
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw error;
    }
  }

  async createNewForm(req: Request, res: Response) {
    let data: any = req.body;
    let headerImage: any = req.files['headerImage'];
    let categorizeQuestionImage: any = req.files['categorizeQuestionImage'];
    let clozeQuestionImage: any = req.files['clozeQuestionImage'];
    let comprehensionQuestionImage: any = req.files['comprehensionQuestionImage'];

    if (headerImage) {
      let img = await this.uploadImageToFirebase(headerImage);
      data.headerImage = img;
    }

    if (categorizeQuestionImage) {
      let img = await this.uploadImageToFirebase(categorizeQuestionImage);
      data.questions.categorizeQuestion.categorizeQuestionImage = img;
    }

    if (clozeQuestionImage) {
      let img = await this.uploadImageToFirebase(clozeQuestionImage);
      data.questions.clozeQuestion.clozeQuestionImage = img;
    }

    if (comprehensionQuestionImage) {
      let img = await this.uploadImageToFirebase(comprehensionQuestionImage);
      data.questions.comprehensionQuestion.comprehensionQuestionImage = img;
    }

    let formRes: any = await this.formRepo.createNewFrom(data).catch((reason) => {
      console.error('createNewForm: Failed to create Form reason - ', reason.message);
      Logger.error('createNewForm: ' + reason);
      return this.getDbError(reason);
    });

    if (formRes.error) {
      this.sendError(res, this.getModifiedError(formRes, Status.ERROR_CODES.forms.create_failed_msg));
      return;
    }

    Logger.info('createNewForm: ' + Status.SERVER_SUCCESS.forms.create_success);
    this.sendSuccess(res, Status.HTTP_CODES.CREATED, formRes);
  }

  async getAllForms(req: Request, res: Response) {
    let { getAllForms, count }: any = await this.formRepo.getAllForms().catch((reason) => {
      console.error('getAllForms: Failed to get Forms reason - ', reason.message);
      Logger.error('getAllForms: ' + reason);
      return this.getDbError(reason);
    });

    if (getAllForms.error) {
      this.sendError(res, this.getModifiedError(getAllForms, Status.ERROR_CODES.forms.get_failed_msg));
    }

    if (getAllForms.length === 0) {
      Logger.error('getAllForms: ' + Status.SERVER_ERRORS.get_failed);
      this.sendError(res, Status.ERROR_CODES.forms.get_failed_msg);
      return;
    }

    Logger.info('getAllForms: ' + Status.SERVER_SUCCESS.forms.get_all_success);
    this.sendSuccess(res, Status.HTTP_CODES.SUCCESS, getAllForms, count);
  }

  async getFormById(req: Request, res: Response) {
    let formId = req.params.formId;

    let getFormByIdRes: any = await this.formRepo.getFormById(formId).catch((reason) => {
      console.error('getFormById: Failed to get Form reason - ', reason.message);
      Logger.error('getFormById: ' + reason);
      return this.getDbError(reason);
    });

    if (getFormByIdRes == null || getFormByIdRes.error) {
      Logger.error('getFormById: ' + Status.SERVER_ERRORS.invalid_id);
      this.sendError(res, Status.ERROR_CODES.forms.get_failed_msg);
      return;
    }

    Logger.info('getFormById: ' + Status.SERVER_SUCCESS.forms.get_success);
    this.sendSuccess(res, Status.HTTP_CODES.SUCCESS, getFormByIdRes);
  }

  async updateForm(req: Request, res: Response) {
    let formId = req.params.formId;
    let data: IForm = req.body;
    let headerImage: any = req.files['headerImage'];
    let categorizeQuestionImage: any = req.files['categorizeQuestionImage'];
    let clozeQuestionImage: any = req.files['clozeQuestionImage'];
    let comprehensionQuestionImage: any = req.files['comprehensionQuestionImage'];

    if (headerImage) {
      let img = await this.uploadImageToFirebase(headerImage);
      data.headerImage = img;
    }

    if (categorizeQuestionImage) {
      let img = await this.uploadImageToFirebase(categorizeQuestionImage);
      (data.questions as IQuestion).categorizeQuestion.categorizeQuestionImage = img;
    }

    if (clozeQuestionImage) {
      let img = await this.uploadImageToFirebase(clozeQuestionImage);
      (data.questions as IQuestion).clozeQuestion.clozeQuestionImage = img;
    }

    if (comprehensionQuestionImage) {
      let img = await this.uploadImageToFirebase(comprehensionQuestionImage);
      (data.questions as IQuestion).comprehensionQuestion.comprehensionQuestionImage = img;
    }

    let updateFormRes: any = await this.formRepo.updateForm(formId, data).catch((reason) => {
      console.error('updateForm: Failed to update Form reason - ', reason.message);
      Logger.error('updateForm: ' + reason);
      return this.getDbError(reason);
    });

    if (updateFormRes == null || updateFormRes.error) {
      Logger.error('updateForm: ' + Status.SERVER_ERRORS.update_failed);
      this.sendError(res, Status.ERROR_CODES.forms.update_failed_msg);
      return;
    }

    Logger.info('updateForm: ' + Status.SERVER_SUCCESS.forms.update_success);
    this.sendSuccess(res, Status.HTTP_CODES.SUCCESS, updateFormRes);
  }

  async deleteForm(req: Request, res: Response) {
    let formId = req.params.formId;

    let getFormByIdRes: any = await this.formRepo.getFormById(formId).catch((reason) => {
      console.error('getFormById: Failed to get Form reason - ', reason.message);
      Logger.error('getFormById: ' + reason);
      return this.getDbError(reason);
    });

    if (getFormByIdRes == null || getFormByIdRes.error) {
      Logger.error('getFormById: ' + Status.SERVER_ERRORS.invalid_id);
      this.sendError(res, Status.ERROR_CODES.forms.get_failed_msg);
      return;
    }

    if (getFormByIdRes.headerImage) {
      await this.deleteImageFromFirebase(getFormByIdRes.headerImage).catch((e) => {
        console.log(e);
      });
    }

    if (getFormByIdRes.questions.categorizeQuestion.categorizeQuestionImage) {
      await this.deleteImageFromFirebase(getFormByIdRes.questions.categorizeQuestion.categorizeQuestionImage).catch((e) => {
        console.log(e);
      });
    }

    if (getFormByIdRes.questions.clozeQuestion.clozeQuestionImage) {
      await this.deleteImageFromFirebase(getFormByIdRes.questions.clozeQuestion.clozeQuestionImage).catch((e) => {
        console.log(e);
      });
    }

    if (getFormByIdRes.questions.comprehensionQuestion.comprehensionQuestionImage) {
      await this.deleteImageFromFirebase(getFormByIdRes.questions.comprehensionQuestion.comprehensionQuestionImage).catch((e) => {
        console.log(e);
      });
    }

    let deleteFormRes: any = await this.formRepo.deleteForm(formId, getFormByIdRes.questions._id).catch((reason) => {
      console.error('deleteForm: Failed to delete Form reason - ', reason.message);
      Logger.error('deleteForm: ' + reason);
      return this.getDbError(reason);
    });

    if (deleteFormRes == null || deleteFormRes.error) {
      Logger.error('deleteForm: ' + Status.SERVER_ERRORS.delete_failed);
      this.sendError(res, Status.ERROR_CODES.forms.delete_failed_msg);
      return;
    }

    Logger.info('deleteForm: ' + Status.SERVER_SUCCESS.forms.delete_success);
    this.sendSuccess(res, Status.HTTP_CODES.SUCCESS, deleteFormRes);
  }
}

export default FormController;
