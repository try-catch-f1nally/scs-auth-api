import {Application, Log4jsService, AjvService, MongoDb} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import {UserModelImpl} from './user/user.model';
import {AuthValidatorImpl} from './auth/auth.validator';
import {AuthServiceImpl} from './auth/auth.service';
import {AuthController} from './auth/auth.controller';

const log4jsService = new Log4jsService(config);
const ajvService = new AjvService(config);
const authValidator = new AuthValidatorImpl(ajvService);
const authService = new AuthServiceImpl(config, UserModelImpl);
const authController = new AuthController(authService, authValidator);
const mongoDb = new MongoDb(config, log4jsService.getLogger('MongoDB'));

void new Application({
  controllers: [authController],
  logger: log4jsService.getLogger('Application'),
  connectableServices: [mongoDb],
  config
}).start();
