import { ConfigService } from '@nestjs/config';

import mongoose from 'mongoose';

export function getMongoModuleOption(configServer: ConfigService) {
  const DATABASE_URL = configServer.get('DATABASE_URL');
  const DATABASE_DEBUG = !!configServer.get('DATABASE_DEBUG');
  mongoose.set('debug', DATABASE_DEBUG);

  return {
    uri: DATABASE_URL,
  };
}
