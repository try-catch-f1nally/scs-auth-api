import {LoginData, LogoutData, RefreshData, RegisterData, UserData} from './auth.types';

export interface AuthService {
  register(registerData: RegisterData): Promise<UserData>;
  login(loginData: LoginData): Promise<UserData>;
  logout(logoutData: LogoutData): Promise<void>;
  refresh(refreshData: RefreshData): Promise<UserData>;
}
