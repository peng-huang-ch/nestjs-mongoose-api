import { MongooseModule } from '@nestjs/mongoose';

import { UserEntity, UserSchema } from './entities';

export const modelProviders = [
  MongooseModule.forFeature([
    { name: UserEntity.name, schema: UserSchema }, // user
  ]),
];
