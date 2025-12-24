import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  MONGO_URI: process.env.MONGO_URI,
}));
