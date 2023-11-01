interface IResponse<T> {
  success: boolean;
  errorCode: number | string;
  message: string | number;
  data: T | undefined;
  count: number | undefined;
}

export default class BaseResponse {
  constructor() {}

  private response: IResponse<any> = {
    success: false,
    errorCode: 0,
    message: '',
    data: {},
    count: 0,
  };

  protected getError(code: string | number, message: string | number): any {
    this.response.errorCode = code;
    this.response.message = message;
    return this.response;
  }

  protected sendError(res: any, error: (string | number)[]) {
    this.response.success = false;
    delete this.response.data;
    delete this.response.count;
    let errorObj = this.getError(error[0], error[1]);
    res.status(error[2]).send(errorObj);
  }

  protected sendSuccess(res: any, statusCode: string | number, data: any, count?: number) {
    this.response.success = true;
    this.response.data = data;
    this.response.count = count;
    delete this.response.errorCode;
    delete this.response.message;
    res.status(statusCode).send(this.response);
  }
}
