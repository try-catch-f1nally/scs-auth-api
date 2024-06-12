import {
  BadRequestError,
  Controller,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router
} from '@try-catch-f1nally/express-microservice';
import {UserService} from './user.service.interface';
import {UserValidator} from './user.validator.interface';

export class UserController implements Controller {
  private readonly _router = Router();
  private readonly _userService: UserService;
  private readonly _userValidator: UserValidator;
  private readonly _authMiddleware: RequestHandler;

  constructor(userService: UserService, userValidator: UserValidator, authMiddleware: RequestHandler) {
    this._userService = userService;
    this._userValidator = userValidator;
    this._authMiddleware = authMiddleware;
    this._initialiseRouter();
  }

  get router() {
    return this._router;
  }

  private _initialiseRouter() {
    this._router.patch('/users/:id/login', this._authMiddleware, this._changeLogin.bind(this));
    this._router.patch('/users/:id/password', this._authMiddleware, this._changePassword.bind(this));
  }

  private async _changeLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id === 'current' ? req.user!.id : req.params.id;
      const data = req.body as unknown;
      if (!this._userValidator.validateChangeLoginRequestBody(data)) {
        throw new BadRequestError(
          'Invalid request body data',
          this._userValidator.validateChangeLoginRequestBody.errors
        );
      }
      await this._userService.changeLogin({userId, ...data});
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private async _changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id === 'current' ? req.user!.id : req.params.id;
      const data = req.body as unknown;
      if (!this._userValidator.validateChangePasswordRequestBody(data)) {
        throw new BadRequestError(
          'Invalid request body data',
          this._userValidator.validateChangePasswordRequestBody.errors
        );
      }
      await this._userService.changePassword({userId, ...data});
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
