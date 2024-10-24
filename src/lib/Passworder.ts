import { Logger } from '@nestjs/common';
import { hash, argon2id, verify } from 'argon2';

import envConfig from 'src/config/envConfig';

class Password {
  logger = new Logger(Password.name);

  async hashPassword(password: string) {
    return hash(password, {
      type: argon2id,
      salt: Buffer.from(envConfig.app.passwordSalt),
    });
  }

  async generateRandomPassword() {
    const rawPassword = Math.random().toString(32).slice(2);
    const hashedPassword = await this.hashPassword(rawPassword);

    return { rawPassword, hashedPassword };
  }

  async validatePassword(password: string, hashedPassword: string) {
    try {
      return await verify(hashedPassword, password);
    } catch (err) {
      this.logger.error('Ошибка проверки пароля:', err);
      return false;
    }
  }
}

export const Passworder = new Password();
