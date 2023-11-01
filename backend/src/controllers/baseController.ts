import moment from 'moment';
import BaseResponse from '../utils/base-response.utils';
import StatusMessage from '../utils/status-codes-messages.utils';

export default class BaseController extends BaseResponse {
  protected checkQueryValidate(query: any) {
    let error: any = '';
    let startDateExist = query.hasOwnProperty('startDate');
    let endDateExist = query.hasOwnProperty('endDate');
    let sortExist = query.hasOwnProperty('sortBy');
    let sortOrderExist = query.hasOwnProperty('sortOrder');

    if (startDateExist !== endDateExist) {
      error = StatusMessage.SERVER_ERRORS.queryDate;
      return error;
    }
    if (startDateExist && endDateExist) {
      let startDateValid = this.checkDateFormat(query.startDate);
      let endDateValid = this.checkDateFormat(query.endDate);
      if (!startDateValid || !endDateValid) {
        error = StatusMessage.SERVER_ERRORS.queryDateFormat;
        return error;
      }

      if (!moment(query.startDate).isSameOrBefore(query.endDate)) return StatusMessage.SERVER_ERRORS.queryStartDateBetweenEndDate;
    }

    if (sortExist !== sortOrderExist) {
      error = StatusMessage.SERVER_ERRORS.querySort;
      return error;
    }
  }

  private checkDateFormat(date: string) {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }

  protected getDbError(reason: any) {
    // console.log('reason.name', reason.name);
    let errCode: number;
    switch (reason.name) {
      case StatusMessage.DB_ERRORS.accessDeniedError:
        errCode = 1024;
        break;
      case StatusMessage.DB_ERRORS.uniqueConstantError:
        errCode = 1062;
        break;
      case StatusMessage.DB_ERRORS.validationError:
        errCode = 1063;
        break;
      case StatusMessage.DB_ERRORS.MongoDBConnectionError:
        errCode = 1064;
        break;
      default:
        errCode = 1001;
        break;
    }
    return {
      error: true,
      errCode: 500,
    };
  }

  protected getQueryError(reason: any) {
    console.log('reason.name', reason);
    let errCode: number;
    switch (reason) {
      case StatusMessage.SERVER_ERRORS.queryDate:
        errCode = 1025;
        break;
      case StatusMessage.SERVER_ERRORS.querySort:
        errCode = 1031;
        break;
      case StatusMessage.SERVER_ERRORS.queryDateFormat:
        errCode = 1065;
        break;
      case StatusMessage.SERVER_ERRORS.queryStartDateBetweenEndDate:
        errCode = 1066;
        break;
      default:
        errCode = 1001;
        break;
    }
    return {
      error: true,
      errCode,
    };
  }
  protected getModifiedError(err: any, errMsg: Array<any>) {
    errMsg[0] = err.errCode;
    return errMsg;
  }

  protected giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + '-' + time;
    return dateTime;
  };

  protected extractPathFromImageUrl(imageUrl: string): string | null {
    const urlParts = imageUrl.split('/');
    const oIndex = urlParts.indexOf('o');

    if (oIndex !== -1) {
      const path = urlParts.slice(oIndex + 1).join('/');
      const pathWithoutQuery = path.split('?')[0];
      const cleanedPath = decodeURIComponent(pathWithoutQuery);
      return cleanedPath;
    }

    return null; // Return null for an invalid URL format
  }
}
