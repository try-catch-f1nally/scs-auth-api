import {ValidationFunction} from '@try-catch-f1nally/express-microservice';
import {ChangeLoginRequestBody, ChangePasswordRequestBody} from './user.types';

export interface UserValidator {
  validateChangeLoginRequestBody: ValidationFunction<ChangeLoginRequestBody>;
  validateChangePasswordRequestBody: ValidationFunction<ChangePasswordRequestBody>;
}
