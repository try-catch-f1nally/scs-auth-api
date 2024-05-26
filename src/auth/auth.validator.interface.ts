import {ValidationFunction} from '@try-catch-f1nally/express-microservice';
import {LoginData, LogoutData, RefreshData, RegisterData} from './auth.types';

export interface AuthValidator {
  validateRegisterData: ValidationFunction<RegisterData>;
  validateLoginData: ValidationFunction<LoginData>;
  validateLogoutData: ValidationFunction<LogoutData>;
  validateRefreshData: ValidationFunction<RefreshData>;
}
