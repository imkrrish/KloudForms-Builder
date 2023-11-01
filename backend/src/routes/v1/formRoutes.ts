import { Router } from 'express';
import FormController from '../../controllers/FormController';

class formRoutes {
  appRouter = Router();
  formCtrl = new FormController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.appRouter
      .route('/')
      .get((req, res) => this.formCtrl.getAllForms(req, res))
      .post((req, res) => this.formCtrl.createNewForm(req, res));

    this.appRouter
      .route('/:formId')
      .get((req, res) => this.formCtrl.getFormById(req, res))
      .put((req, res) => this.formCtrl.updateForm(req, res))
      .delete((req, res) => this.formCtrl.deleteForm(req, res));
  }
}

export default new formRoutes().appRouter;
