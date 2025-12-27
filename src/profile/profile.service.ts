import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  public async createProfile(createProfileDto: CreateProfileDto) {
    try {
      const profile = new this.profileModel({
        user: createProfileDto.userId,
      });
      await profile.save();
    } catch (error) {
      throw new InternalServerErrorException(error, {
        description: 'Something went wrong while creating the transaction',
      });
    }
  }

  public async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {}
}
