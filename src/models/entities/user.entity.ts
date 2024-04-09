import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import mongoose, { Document } from 'mongoose';

export type AccountDocument = UserEntity & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity {
  @ApiProperty({ required: false, nullable: true })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @Prop({ required: false })
  email: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Prop({ required: false })
  iconUrl: string | null;

  @ApiHideProperty()
  @Prop({ required: false })
  googleId: string | null;

  @ApiHideProperty()
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  googleProps: Record<string, any>;

  @ApiProperty({ required: false, nullable: true })
  @Prop({ required: false, type: [String] })
  roles: string[];

  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.index({ email: 1 }, { background: true });
UserSchema.index({ googleId: 1 }, { background: true, sparse: true });
