import {ValidationFunction, ValidationService} from '@try-catch-f1nally/express-microservice';
import {AuthValidator} from './auth.validator.interface';
import {LoginData, LogoutData, RefreshData, RegisterData} from './auth.types';

export class AuthValidatorImpl implements AuthValidator {
  private readonly _validationService: ValidationService;
  public readonly validateRegisterData: ValidationFunction<RegisterData>;
  public readonly validateLoginData: ValidationFunction<LoginData>;
  public readonly validateLogoutData: ValidationFunction<LogoutData>;
  public readonly validateRefreshData: ValidationFunction<RefreshData>;

  constructor(validationService: ValidationService) {
    this._validationService = validationService;
    this.validateRegisterData = this._compileRegisterValidator();
    this.validateLoginData = this._compileLoginValidator();
    this.validateLogoutData = this._compileLogoutValidator();
    this.validateRefreshData = this._compileRefreshValidator();
  }

  private _compileRegisterValidator() {
    return this._validationService.getValidator<RegisterData>({
      type: 'object',
      properties: {
        login: {
          type: 'string',
          minLength: 5,
          errorMessage: {
            type: 'login must be type of string',
            minLength: 'login must be greater than or equal to 5 characters'
          }
        },
        password: {
          type: 'string',
          minLength: 5,
          errorMessage: {
            type: 'password must be type of string',
            minLength: 'password must be greater than or equal to 5 characters'
          }
        }
      },
      required: ['login', 'password'],
      errorMessage: {
        required: {
          login: 'no login specified',
          password: 'no password specified'
        }
      }
    });
  }

  private _compileLoginValidator() {
    return this._validationService.getValidator<LoginData>({
      type: 'object',
      properties: {
        login: {
          type: 'string',
          errorMessage: 'login must be type of string'
        },
        password: {
          type: 'string',
          errorMessage: 'password must be type of string'
        }
      },
      required: ['login', 'password'],
      errorMessage: {
        required: {
          login: 'no login specified',
          password: 'no password specified'
        }
      }
    });
  }

  private _compileLogoutValidator() {
    return this._validationService.getValidator<LogoutData>({
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          errorMessage: 'refreshToken bust be type of string'
        }
      },
      required: ['refreshToken'],
      errorMessage: {
        required: {
          refreshToken: 'no refresh token specified'
        }
      }
    });
  }

  private _compileRefreshValidator() {
    return this._validationService.getValidator<RefreshData>({
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          errorMessage: 'refreshToken bust be type of string'
        }
      },
      required: ['refreshToken'],
      errorMessage: {
        required: {
          refreshToken: 'no refresh token specified'
        }
      }
    });
  }
}
