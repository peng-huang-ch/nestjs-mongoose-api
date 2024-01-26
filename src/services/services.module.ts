import { Module } from '@nestjs/common';

import { ModelsModule } from '@src/models';

import { UsersManager, UsersService } from './users';

@Module({
  imports: [ModelsModule],
  providers: [UsersManager, UsersService],
  exports: [UsersManager],
})
export class ServicesModule {}
