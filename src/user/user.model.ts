import crypto from 'crypto';
import {model, Schema} from 'mongoose';
import {UserDocument, UserModel} from './user.model.interface';

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    login: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true, default: crypto.randomBytes(16).toString('hex')},
    token: {type: String}
  },
  {
    methods: {
      comparePassword(password: string) {
        return _hashPassword(password, this.salt) === this.password;
      }
    }
  }
);

UserSchema.index({login: 1});

UserSchema.pre<UserDocument>('save', function () {
  if (this.isModified('password')) {
    this.password = _hashPassword(this.password, this.salt);
  }
});

function _hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 10, 64, 'sha512').toString('hex');
}

export const UserModelImpl = model<UserDocument, UserModel>('User', UserSchema);
