export default class StatusMessage {
  static readonly HTTP_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  };

  static readonly SERVER_ERRORS = {
    internal_error: 'Internal Error',
    rate_limit_reached: 'Rate limit exceeded, please try again later some time.',
    validation_error: 'Validation Error',
    queryDate: 'Both start date and end date are required',
    queryDateFormat: 'Date should be in YYYY/MM/DD format',
    queryStartDateBetweenEndDate: 'Start date should be less than end date',
    querySort: 'Both sortBy and sort order are required',
    db_error: 'Database connection issues',
    no_information_provided: 'No Information provided to update',
    invalid_id: 'Invalid ID',
    add_failed: 'Failed to add',
    get_failed: 'Failed to fetch',
    update_failed: 'Failed to update',
    delete_failed: 'Failed to delete',
    not_found: 'Not found',
  };

  static readonly ERROR_CODES = {
    internal_error_msg: [1001, StatusMessage.SERVER_ERRORS.internal_error, 500],

    forms: {
      create_failed_msg: [1002, StatusMessage.SERVER_ERRORS.add_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
      get_failed_msg: [1003, StatusMessage.SERVER_ERRORS.get_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
      not_found_msg: [1004, StatusMessage.SERVER_ERRORS.not_found, StatusMessage.HTTP_CODES.NOT_FOUND],
      update_failed_msg: [1008, StatusMessage.SERVER_ERRORS.update_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
      delete_failed_msg: [1009, StatusMessage.SERVER_ERRORS.delete_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
    },

    user_responses: {
      create_failed_msg: [1005, StatusMessage.SERVER_ERRORS.add_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
      get_failed_msg: [1006, StatusMessage.SERVER_ERRORS.get_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
      not_found_msg: [1007, StatusMessage.SERVER_ERRORS.not_found, StatusMessage.HTTP_CODES.NOT_FOUND],
      delete_failed_msg: [1010, StatusMessage.SERVER_ERRORS.delete_failed, StatusMessage.HTTP_CODES.SERVER_ERROR],
    },
  };

  static readonly SERVER_SUCCESS = {
    forms: {
      create_success: 'Form created successfully',
      get_success: 'Form retrieved successfully',
      get_all_success: 'All forms retrieved successfully',
      update_success: 'Form updated successfully',
      delete_success: 'Form deleted successfully',
    },

    user_responses: {
      create_success: 'User response created successfully',
      get_success: 'User response retrieved successfully',
      get_all_success: 'All user responses for the form retrieved successfully',
      delete_success: 'User response deleted successfully',
    },
  };

  static readonly DB_ERRORS = {
    uniqueConstantError: 'MongoDBUniqueConstraintError',
    validationError: 'MongoDBValidationError',
    accessDeniedError: 'MongoDBAccessDeniedError',
    MongoDBConnectionError: 'MongoDBConnectionError',
  };
  
  static readonly DB_LOGS = {
    DB_CONNECTED_SYNC_SUCCESS_MSG: '####### Database connected and synced successfully #######',
  };

  constructor() {}
}
