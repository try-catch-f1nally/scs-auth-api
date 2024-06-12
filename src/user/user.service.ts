import {UserService} from './user.service.interface';
import {UserModel} from './user.model.interface';
import {ChangeLoginData, ChangePasswordData} from './user.types';
import {BadRequestError} from '@try-catch-f1nally/express-microservice';

export class UserServiceImpl implements UserService {
  private readonly _userModel: UserModel;

  constructor(userModel: UserModel) {
    this._userModel = userModel;
  }

  async changeLogin({userId, login}: ChangeLoginData) {
    const existingUserWithLogin = await this._userModel.findOne({login});
    if (existingUserWithLogin) {
      throw new BadRequestError('User with such login already exist');
    }
    const {modifiedCount} = await this._userModel.updateOne({_id: userId}, {$set: {login}});
    if (!modifiedCount) {
      throw new BadRequestError('User with such userId not found');
    }
  }

  async changePassword({userId, oldPassword, newPassword}: ChangePasswordData) {
    const user = await this._userModel.findById(userId);
    if (!user) {
      throw new BadRequestError('User with such userId not found');
    }
    if (!user.comparePassword(oldPassword)) {
      throw new BadRequestError('Incorrect old password');
    }
    user.password = newPassword;
    await user.save();
  }
}
