export type ChangeLoginRequestBody = {
  login: string;
};

export type ChangePasswordRequestBody = {
  oldPassword: string;
  newPassword: string;
};

export type ChangeLoginData = {userId: string} & ChangeLoginRequestBody;
export type ChangePasswordData = {userId: string} & ChangePasswordRequestBody;
