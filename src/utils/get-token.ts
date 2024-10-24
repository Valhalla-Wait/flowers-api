import { Request } from 'express';
import { TokenType } from 'src/auth/constants';

export const getToken = (req: Request, tokenType: TokenType) => {
  return req.cookies[tokenType];
};
