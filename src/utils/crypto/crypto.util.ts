import * as argon2 from 'argon2';
import { Logger } from '@nestjs/common';

export class CryptoUtil {
  private static readonly logger = new Logger(CryptoUtil.name);

  public static async hashWithSalt(plainPassword: string): Promise<string> {
    const hash: string = await argon2.hash(plainPassword);
    console.log(hash);
    return hash;
  }

  public static async verifyPassword(
    hash: string,
    plainPassword: string,
  ): Promise<boolean> {
    const result: boolean = await argon2.verify(hash, plainPassword);
    console.log(result);
    return result;
  }
}
