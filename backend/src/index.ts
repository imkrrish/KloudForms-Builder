import 'dotenv/config';
import express, { Request, Response, NextFunction, Application, urlencoded, json } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import cors from 'cors';
import chalk from 'chalk';
import mongoose from 'mongoose';
import helmet from 'helmet';
import winston from 'winston';
import compression from 'compression';
import morgan from 'morgan';
import { WriteStream } from 'fs';
import nocache from 'nocache';
import fileUpload from 'express-fileupload';
import rateLimit from './middlewares/rateLimit';
import Logger from './utils/winston.utils';
import Routes from './routes/v1/route-index';
import Status from './utils/status-codes-messages.utils';

export default class App {
  constructor() {
    // body parser middleware
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    // logging middlewares
    this.app.use(morgan('dev'));
    this.app.use(morgan('combined', { stream: this.accessLogStream }));
    // security middlewares
    this.app.use(
      cors({
        origin: ['http://localhost:3000', 'https://kontact-five.vercel.app', '*'],
        credentials: true,
      })
    );
    this.app.use(fileUpload());
    this.app.use(rateLimit());
    this.app.use(compression());
    this.app.use(nocache());
    this.app.use(helmet());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

    new Routes(this.app);
  }

  private serverPort: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  public app: Application = express();
  private accessLogStream: WriteStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

  // Clear the console
  private _clearConsole(): void {
    process.stdout.write('\x1B[2J\x1B[0f');
  }

  public async bootstrap() {
    this._clearConsole();
    const uri: string = process.env.MONGODB_URI;
    mongoose.set('strictQuery', false);
    mongoose.connect(uri).then(() => {
      Logger.info('MongoDB Connect: ' + Status.DB_LOGS.DB_CONNECTED_SYNC_SUCCESS_MSG);
      console.log(chalk.green.bold('Server successfully connected with MongoDB!'));
      this.app
        .listen(this.serverPort, function () {
          console.info(`Server running on : http://localhost:${process.env.PORT}`);
          Logger.info(`Server running on : http://localhost:${process.env.PORT}`);
        })
        .on('error', (err: Error) => {
          console.log(err);
        });
    });

    process.on('beforeExit', function (err) {
      winston.error(JSON.stringify(err));
      console.log(err);
    });
  }
}
