import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { Cache } from 'cache-manager';
import { isEmpty, omit, pick } from 'lodash';
import type { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import { Role } from '@src/common';
import { UserEntity } from '@src/models';

import { UsersService } from './users.service';

@Injectable()
export class UsersManager {
  constructor(
    @Inject(CACHE_MANAGER) readonly cacheManager: Cache,
    readonly usersSvc: UsersService,
  ) {}

  private getUserIdCacheKey(userId: string) {
    return `users_id_${userId}`;
  }

  async isAdmin(email: string): Promise<UserEntity> {
    const where = { email, roles: Role.Admin };
    return await this.usersSvc.findOne({ where });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const where = { email };
    return await this.usersSvc.findOne({ where });
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const key = this.getUserIdCacheKey(userId);
    return this.cacheManager.wrap<UserEntity>(
      key,
      async () => {
        const where = { _id: userId };
        const options = { lean: true };
        const user = await this.usersSvc.findOne(where, null, options);
        return Object.assign({}, user);
      },
      (value) => (!isEmpty(value) ? 60 * 60 * 1000 : 3 * 1000),
    );
  }

  async removeUserById(userId: string): Promise<UserEntity> {
    const key = this.getUserIdCacheKey(userId);
    const where = { id: userId };
    const removed = await this.usersSvc.findOneAndDelete(where);
    await this.cacheManager.del(key);
    return removed;
  }

  async createUser(filter: FilterQuery<UserEntity>, update: UpdateQuery<UserEntity>, options?: QueryOptions<UserEntity>): Promise<UserEntity> {
    options = Object.assign({}, options, { upsert: true, new: true });
    return await this.usersSvc.findOneAndUpdate(filter, update, options);
  }

  async updateUserById(userId: string, update: Partial<UserEntity>): Promise<UserEntity> {
    const key = this.getUserIdCacheKey(userId);
    const where = { id: userId };
    const options = { new: true };
    const user = await this.usersSvc.findOneAndUpdate(where, update, options);
    this.cacheManager.del(key);
    return user;
  }

  async login(where: FilterQuery<UserEntity>, data: Partial<UserEntity>): Promise<UserEntity> {
    const props = omit(data, ['name', 'email', 'iconUrl']);
    const placeholder = pick(data, ['name', 'email', 'iconUrl']);
    const update = { $set: props, $setOnInsert: placeholder };
    const options = { upsert: true, new: true };
    const saved = await this.usersSvc.findOneAndUpdate(where, update, options);
    const key = this.getUserIdCacheKey(saved._id);
    await this.cacheManager.del(key);
    return saved;
  }
}
