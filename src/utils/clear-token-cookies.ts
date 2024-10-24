import { Response } from 'express';
import { TokenType } from 'src/auth/constants';

export const clearTokenCookies = (res: Response): void => {
  for (const type of Object.values(TokenType)) {
    res.clearCookie(type);
  }
};
