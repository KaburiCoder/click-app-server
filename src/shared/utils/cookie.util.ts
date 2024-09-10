import { CookieOptions, Request, Response } from 'express';

export class CookieUtil {
  private constructor(private key: CookieKey) { };

  static of(key: CookieKey) {
    return new CookieUtil(key);
  }

  setCookie(res: Response, val: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const options: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
    };

    res.cookie(this.key, val, options);
  }

  getCookie(req: Request) {
    return req.cookies?.[this.key];
  }

  clearCookie(res: Response) {
    res.clearCookie(this.key);
  }
}

export enum CookieKey {
  accJwt = "a_jwt",
  refJwt = "r_jwt",
}