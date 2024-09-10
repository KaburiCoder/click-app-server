import { PayloadDto } from '@/shared/dto/payload.dto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      currentUser?: PayloadDto;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = this.jwtService.verify(token);

        req.currentUser = decoded;
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }

    next();
  }
}
