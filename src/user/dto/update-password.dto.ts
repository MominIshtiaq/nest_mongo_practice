import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 8 })
  newPassword: string;
}
