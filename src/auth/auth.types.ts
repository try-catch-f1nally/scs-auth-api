export type UserData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type RegisterData = {
  login: string;
  password: string;
};

export type LoginData = {
  login: string;
  password: string;
};

export type LogoutData = {
  refreshToken: string;
};

export type RefreshData = {
  refreshToken: string;
};
