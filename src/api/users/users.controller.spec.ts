import { CacheModule } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';
import { TraceService } from 'nestjs-otel';

import { UserEntity } from '@src/models';
import { UsersManager, UsersService } from '@src/services';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        UsersManager,
        UsersService,
        TraceService,
        {
          provide: getModelToken(UserEntity.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
