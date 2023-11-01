import moment from 'moment';

export default class BaseRepo {
  constructor() {}

  // setStatus(matchQuery: any, type: string): void {
  //   switch (type) {
  //     case 'inactive':
  //       matchQuery.isActive = false;
  //       break;
  //     case 'all':
  //       break;
  //     case 'active':
  //     default:
  //       matchQuery.isActive = true;
  //   }
  // }

  // setQueryDate(matchQuery: any, startDate: string | undefined, endDate: string | undefined): void {
  //   if (startDate && endDate) {
  //     const startedDate = new Date(moment(startDate).format('YYYY-MM-DDT00:00:00.000') + 'Z');
  //     const endedDate = new Date(moment(endDate).format('YYYY-MM-DDT23:59:59.999') + 'Z');
  //     matchQuery.createdAt = {
  //       $gte: startedDate,
  //       $lte: endedDate,
  //     };
  //   }
  // }


  getPagination(query: any): { skip: number; limit: number } {
    const page = query.page || 1;
    const limit = query.perpage || 50;
    const skip = (page - 1) * limit;

    return {
      skip,
      limit,
    };
  }

  setOrder(query: any, defaultSorting: [string, string], order: any): void {
    const sortParameter = query.sortBy || defaultSorting[0];
    let sortOrder = query.sortOrder || defaultSorting[1];
    switch (sortOrder) {
      case 'DESC':
        sortOrder = -1;
        break;
      case 'ASC':
        sortOrder = 1;
        break;
      default:
        break;
    }
    order[sortParameter] = sortOrder;
  }
}
