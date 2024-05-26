import {
  Controller,
  Request,
  Response,
  NextFunction,
  Router,
  BadRequestError
} from '@try-catch-f1nally/express-microservice';
import {AuthService} from './auth.service.interface';
import {AuthValidator} from './auth.validator.interface';

export class AuthController implements Controller {
  private readonly _router = Router();
  private readonly _authService: AuthService;
  private readonly _authValidator: AuthValidator;

  constructor(authService: AuthService, authValidator: AuthValidator) {
    this._authService = authService;
    this._authValidator = authValidator;
    this._registerRoutes();
  }

  get router() {
    return this._router;
  }

  private _registerRoutes() {
    this.router.post('/register', this._register.bind(this));
    this.router.post('/login', this._login.bind(this));
    this.router.post('/logout', this._logout.bind(this));
    this.router.post('/refresh', this._refresh.bind(this));
  }

  private async _register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as unknown;
      if (!this._authValidator.validateRegisterData(data)) {
        throw new BadRequestError('Invalid registration data', this._authValidator.validateRegisterData.errors);
      }
      const userData = await this._authService.register(data);
      return res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }

  private async _login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as unknown;
      if (!this._authValidator.validateLoginData(data)) {
        throw new BadRequestError('Invalid login data', this._authValidator.validateLoginData.errors);
      }
      const userData = await this._authService.login(data);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  private async _logout(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as unknown;
      if (!this._authValidator.validateLogoutData(data)) {
        throw new BadRequestError('Invalid logout data', this._authValidator.validateLogoutData.errors);
      }
      await this._authService.logout(data);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private async _refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as unknown;
      if (!this._authValidator.validateRefreshData(data)) {
        throw new BadRequestError('Invalid refresh data', this._authValidator.validateRefreshData.errors);
      }
      const userData = await this._authService.refresh(data);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}
