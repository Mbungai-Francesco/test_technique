import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookie
        (request: Request) => {
          return request?.cookies?.access_token;
        },
        // Fallback to Authorization header for API clients
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return this.authService.validateUser(payload.sub);
  }
}
