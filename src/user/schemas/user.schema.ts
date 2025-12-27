import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEnum } from '../constants';

@Schema({
  timestamps: true, // automatically adds createdAt & updatedAt
})
export class User {
  @Prop({ type: String, required: true, unique: true, maxLength: 24 })
  username: string;

  @Prop({ type: String, required: true, unique: true, maxLength: 24 })
  email: string;

  @Prop({ type: String, required: true, maxLength: 100 })
  password: string;

  @Prop({ type: String, enum: UserEnum, default: UserEnum.User })
  role: UserEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
