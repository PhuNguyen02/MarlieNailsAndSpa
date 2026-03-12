import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerAuthController } from './customer-auth.controller';
import { Customer } from '../../entities/customer.entity';
import { CustomerJwtStrategy } from './strategies/customer-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PassportModule.register({ defaultStrategy: 'customer-jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'MarlieSpaSecretKey2024',
      signOptions: { expiresIn: '7d' }, // Khách hàng cho login lâu hơn
    }),
  ],
  providers: [CustomerAuthService, CustomerJwtStrategy],
  controllers: [CustomerAuthController],
  exports: [CustomerAuthService],
})
export class CustomerAuthModule {}
