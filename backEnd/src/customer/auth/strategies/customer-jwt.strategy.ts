import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomerAuthService } from '../customer-auth.service';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
  constructor(
    private readonly authService: CustomerAuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('[DEBUG] CustomerJwtStrategy payload:', payload);
    // sub là id của customer
    const customer = await this.authService.validateCustomer(payload.sub);
    if (!customer) {
      console.log('[DEBUG] Customer validation failed for sub:', payload.sub);
      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');
    }
    console.log('[DEBUG] Customer validation success for:', customer.fullName);
    return customer;
  }
}
