import { Injectable } from '@nestjs/common';

import type { DeleteOptions } from 'mongodb';
import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class BaseService<T> {
  constructor(readonly model: Model<T>) {}

  async find(filter: FilterQuery<T>, projection: ProjectionType<T> = { __v: 0 }, options?: QueryOptions<T>) {
    return this.model.find(filter, projection, options).lean().exec();
  }

  async cursor(filter: FilterQuery<T> = {}, projection?: ProjectionType<T>, batchSize = 30) {
    return this.model.find(filter, projection).cursor({ batchSize });
  }

  async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
    return await this.model.findOne(filter, projection, options);
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: DeleteOptions) {
    return await this.model.updateOne(filter, update, options).lean().exec();
  }

  async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: DeleteOptions) {
    return await this.model.updateMany(filter, update, options).lean().exec();
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>) {
    return await this.model.findOneAndUpdate(filter, update, options).lean().exec();
  }

  async findOneAndDelete(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return await this.model.findOneAndDelete(filter, options).lean().exec();
  }

  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions) {
    return await this.model.deleteOne(filter, options).lean().exec();
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions) {
    return await this.model.deleteMany(filter, options).lean().exec();
  }

  async paginate(query: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
    const [data, total] = await Promise.all([
      this.model.find(query, projection, options).lean().exec(), // data
      this.model.countDocuments(query), // total
    ]);
    return {
      total,
      limit: options?.limit,
      offset: options?.offset,
      data,
    };
  }
}
