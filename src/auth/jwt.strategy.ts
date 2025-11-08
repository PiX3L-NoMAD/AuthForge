import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.headers) return null;
        const auth = req.headers['authorization'];
        if (!auth) return null;
        const parts = auth.split(' ');
        return parts[0] === 'Bearer' && parts[1] ? parts[1] : null;
      },
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    // payload.sub is user id
    return { id: payload.sub, username: payload.username, email: payload.email };
  }
}
