import { Module } from '@nestjs/common';

import { modelProviders } from './model.providers';

@Module({
  imports: modelProviders,
  exports: modelProviders,
})
export class ModelsModule {}
