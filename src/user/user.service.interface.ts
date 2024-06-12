import {ChangeLoginData, ChangePasswordData} from './user.types';

export interface UserService {
  changeLogin(data: ChangeLoginData): Promise<void>;
  changePassword(data: ChangePasswordData): Promise<void>;
}
