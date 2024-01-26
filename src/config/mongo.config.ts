import { ConfigService } from '@nestjs/config';

import mongoose from 'mongoose';

export function getMongoModuleOption(configServer: ConfigService) {
  const DATABASE_URL = configServer.get('DATABASE_URL');
  mongoose.set('debug', DATABASE_URL);

  return {
    uri: DATABASE_URL,
  };
}
