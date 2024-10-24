import { Response, CookieOptions } from 'express';

// NOTE: 30 days
const COOKIE_LIFE_TIME = 30 * 24 * 60 * 60 * 1000;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: COOKIE_LIFE_TIME,
};

export const setTokenCookies = (res: Response, token: string, cookieName: string): void => {
  res.cookie(cookieName, token, cookieOptions);
};
