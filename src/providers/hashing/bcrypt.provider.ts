import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string | Buffer> {
    try {
      const salt = await bcrypt.genSalt();
      const hashpassword = await bcrypt.hash(password, salt);
      return hashpassword;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong during hashing',
      );
    }
  }

  async comparePassword(
    password: string | Buffer,
    compare: string | Buffer,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, compare as string);
      return isMatch;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong during compare',
      );
    }
  }
}
