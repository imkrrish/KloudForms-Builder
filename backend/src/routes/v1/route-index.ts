import { Application } from 'express';
import formRoutes from './formRoutes';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/v1/forms', formRoutes);
  }
}
