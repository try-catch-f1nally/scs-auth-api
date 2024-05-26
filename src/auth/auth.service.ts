import jwt from 'jsonwebtoken';
import {BadRequestError, TokenPayload, UnauthorizedError} from '@try-catch-f1nally/express-microservice';
import {AuthService} from './auth.service.interface';
import {Config} from '../config/config.interface';
import {UserModel} from '../user/user.model.interface';
import {LoginData, LogoutData, RefreshData, RegisterData} from './auth.types';

export class AuthServiceImpl implements AuthService {
  private readonly _config: Config;
  private readonly _userModel: UserModel;

  constructor(config: Config, userModel: UserModel) {
    this._config = config;
    this._userModel = userModel;
  }

  async register({login, password}: RegisterData) {
    const candidate = await this._userModel.findOne({login});
    if (candidate) {
      throw new BadRequestError('User with such login already exists');
    }
    const user = await this._userModel.create({login, password});
    const userId = user.id as string;
    const payload: TokenPayload = {user: {id: userId}};
    const tokens = this._generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();
    return {...tokens, userId};
  }

  async login({login, password}: LoginData) {
    const user = await this._userModel.findOne({login});
    if (!user?.comparePassword(password)) {
      throw new BadRequestError('Wrong login or password');
    }
    const userId = user.id as string;
    const payload = {user: {id: userId}};
    const tokens = this._generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();
    return {...tokens, userId};
  }

  async logout({refreshToken}: LogoutData) {
    const payload = this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw new UnauthorizedError('Invalid refresh token provided');
    }
    const user = await this._userModel.findById(payload.user.id);
    if (!user) {
      throw new Error(`Wrong user id in token: ${refreshToken}`);
    }
    user.token = undefined;
    await user.save();
  }

  async refresh({refreshToken}: RefreshData) {
    const invalidTokenError = new UnauthorizedError('Invalid refresh token provided');

    const payload = this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw invalidTokenError;
    }

    const user = await this._userModel.findOne({_id: payload.user.id});
    if (!user) {
      throw new Error(`Wrong user id in token: ${refreshToken}`);
    }

    const userId = user.id as string;
    const currentToken = user.token;
    user.token = undefined;
    await user.save();

    if (currentToken !== refreshToken) {
      throw invalidTokenError;
    }

    const tokens = this._generateTokens({user: {id: userId}});
    user.token = tokens.refreshToken;
    await user.save();

    return {...tokens, userId};
  }

  _isTokenPayload(decoded: string | jwt.JwtPayload | null): decoded is TokenPayload {
    return (
      // prettier-ignore
      decoded instanceof Object &&
      'user' in decoded &&
      'id' in decoded.user &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof decoded.user.id === 'string'
    );
  }

  _decodeExpiredToken(token: string, secretKey: string) {
    let payload = null;
    try {
      payload = jwt.verify(token, secretKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        payload = jwt.decode(token);
      }
    }
    return this._isTokenPayload(payload) ? payload : null;
  }

  _generateTokens(payload: TokenPayload) {
    const {privateKey, refreshSecret, accessTokenTtlInSeconds, refreshTokenTtlInSeconds} = this._config.auth;
    return {
      accessToken: jwt.sign(payload, privateKey, {algorithm: 'ES256', expiresIn: accessTokenTtlInSeconds}),
      refreshToken: jwt.sign(payload, refreshSecret, {expiresIn: refreshTokenTtlInSeconds})
    };
  }
}
