import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEnum } from '../constants';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';
import mongoose, { Types } from 'mongoose';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.profile) {
    const ProfileModel = this.$model('Profile');
    const profile = await ProfileModel.create({});
    this.profile = profile._id;
  }
});
