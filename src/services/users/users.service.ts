import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { BaseService, UserEntity } from '@src/models';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(@InjectModel(UserEntity.name) readonly model: Model<UserEntity>) {
    super(model);
  }
}
