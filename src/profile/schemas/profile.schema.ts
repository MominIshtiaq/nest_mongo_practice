import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genderEnum } from '../constants';

@Schema()
export class Profile {
  @Prop({ type: String, required: false, maxLength: 100 })
  firstName?: string | null;

  @Prop({ type: String, required: false, maxLength: 100 })
  lastName?: string | null;

  @Prop({ type: String, enum: genderEnum, required: false })
  gender?: genderEnum | null;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date | null;

  @Prop({ type: String, required: false })
  bio?: string | null;

  @Prop({ type: String, required: false })
  profileImage?: string | null;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
