import {AjvService, Application, AuthMiddleware, Log4jsService, MongoDb} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import {UserModelImpl} from './user/user.model';
import {AuthValidatorImpl} from './auth/auth.validator';
import {AuthServiceImpl} from './auth/auth.service';
import {AuthController} from './auth/auth.controller';
import {UserValidatorImpl} from './user/user.validator';
import {UserServiceImpl} from './user/user.service';
import {UserController} from './user/user.controller';

const authMiddleware = new AuthMiddleware(config);
const log4jsService = new Log4jsService(config);
const ajvService = new AjvService(config);
const authValidator = new AuthValidatorImpl(ajvService);
const authService = new AuthServiceImpl(config, UserModelImpl);
const authController = new AuthController(authService, authValidator);
const userValidator = new UserValidatorImpl(ajvService);
const userService = new UserServiceImpl(UserModelImpl);
const userController = new UserController(userService, userValidator, authMiddleware.middleware);
const mongoDb = new MongoDb(config, log4jsService.getLogger('MongoDB'));

void new Application({
  controllers: [authController, userController],
  logger: log4jsService.getLogger('Application'),
  connectableServices: [mongoDb],
  config
}).start();
