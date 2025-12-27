import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/providers/hashing/hashing.provider';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModal: Model<User>,
    @InjectConnection() private readonly connection: Connection,

    private readonly hashingProvider: HashingProvider,
    private readonly profileService: ProfileService,
  ) {}

  public async checkUserExistWithEmail(email: string) {
    let user: User | null;
    user = await this.userModal.findOne({ email }).exec();
    return !!user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const isExistingUser = await this.checkUserExistWithEmail(
        createUserDto.email,
      );

      if (isExistingUser)
        throw new BadRequestException('User with this email already exists');

      /* 
      The equalient of the following line of code is await this.userModal.create(createUserDto).
      This will create the instance to User name and also call the save method and save the user object to the DB
    */

      const user = new this.userModal({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      await user.save();

      await this.profileService.createProfile({ userId: String(user._id) });

      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error, {
        description: 'Error while creating the User',
      });
    }
  }

  async findAll() {
    return await this.userModal.find();
  }

  async findOne(id: string) {
    try {
      const user = await this.userModal.findById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        status: 500,
        message: 'Something went wrong when finding user',
      });
    }
  }

  async updateUserInfo(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModal.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(id);

    const isMatch = await this.hashingProvider.comparePassword(
      updatePasswordDto.password,
      user.password,
    );

    if (!isMatch) throw new BadRequestException('Old password does not match');

    const newUser = await this.userModal.findByIdAndUpdate(
      id,
      {
        password: await this.hashingProvider.hashPassword(
          updatePasswordDto.newPassword,
        ),
      },
      {
        new: true,
      },
    );
    if (!newUser) throw new NotFoundException('User not found');
    return newUser;
  }

  async remove(id: string) {
    const user = await this.userModal.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
