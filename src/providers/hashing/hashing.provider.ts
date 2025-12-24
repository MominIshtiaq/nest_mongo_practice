import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(password: string | Buffer): Promise<string | Buffer>;
  abstract comparePassword(
    password: string | Buffer,
    compare: string | Buffer,
  ): Promise<boolean>;
}
