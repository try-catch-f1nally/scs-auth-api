import mongoose from 'mongoose';
import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export interface Config extends DefaultConfig {
  mongodb: {
    uri: string;
    connectionOptions?: mongoose.ConnectOptions;
  };
  auth: {
    publicKey: string;
    privateKey: string;
    refreshSecret: string;
    accessTokenTtlInSeconds: number;
    refreshTokenTtlInSeconds: number;
  };
}

export interface EnvVars {
  PORT: number;
  MONGODB_HOST: string;
  MONGODB_PORT: number;
  AUTH_PUBLIC_KEY: string;
  AUTH_PRIVATE_KEY: string;
  JWT_SECRET: string;
  FRONTEND_ORIGIN: string;
}
