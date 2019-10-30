export const NOT_FOUND_ERROR = new Error('Entity not found');
export const UNAUTHORIZED = new Error('User is not authorized');

export const errorCodesToNames = {
  404: NOT_FOUND_ERROR,
  401: UNAUTHORIZED,
};

export const DEFAULT_CURRENCY_IS_NOT_SET = new Error(
  'Default currency is not set. Fill the banking info first',
);
