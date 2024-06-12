import {ValidationFunction, ValidationService} from '@try-catch-f1nally/express-microservice';
import {UserValidator} from './user.validator.interface';
import {ChangeLoginRequestBody, ChangePasswordRequestBody} from './user.types';

export class UserValidatorImpl implements UserValidator {
  private readonly _validationService: ValidationService;
  readonly validateChangeLoginRequestBody: ValidationFunction<ChangeLoginRequestBody>;
  readonly validateChangePasswordRequestBody: ValidationFunction<ChangePasswordRequestBody>;

  constructor(validationService: ValidationService) {
    this._validationService = validationService;
    this.validateChangeLoginRequestBody = this._compileChangeLoginRequestBodyValidator();
    this.validateChangePasswordRequestBody = this._compileChangePasswordRequestBodyValidator();
  }

  private _compileChangeLoginRequestBodyValidator() {
    return this._validationService.getValidator<ChangeLoginRequestBody>({
      type: 'object',
      properties: {
        login: {
          type: 'string',
          minLength: 5,
          errorMessage: {
            type: 'login must be type of string',
            minLength: 'login must be greater than or equal to 5 characters'
          }
        }
      },
      required: ['login'],
      errorMessage: {
        login: 'no login specified'
      }
    });
  }

  private _compileChangePasswordRequestBodyValidator() {
    return this._validationService.getValidator<ChangePasswordRequestBody>({
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          errorMessage: {
            type: 'oldPassword must be type of string'
          }
        },
        newPassword: {
          type: 'string',
          minLength: 5,
          errorMessage: {
            type: 'password must be type of string',
            minLength: 'password must be greater than or equal to 5 characters'
          }
        }
      },
      required: ['oldPassword', 'newPassword']
    });
  }
}
