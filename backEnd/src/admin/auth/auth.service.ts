import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../../entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, fullName, phone } = registerDto;

    // Check if email or username already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingAdmin) {
      throw new ConflictException('Email hoặc username đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = this.adminRepository.create({
      email,
      username,
      password: hashedPassword,
      fullName,
      phone,
    });

    await this.adminRepository.save(admin);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: adminPassword, ...result } = admin;
    return {
      status: 200,
      data: result,
      message: 'Đăng ký thành công',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find admin by email
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Update last login
    admin.lastLogin = new Date();
    await this.adminRepository.save(admin);

    const payload = { email: admin.email, sub: admin.id };

    return {
      status: 200,
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        access_token: this.jwtService.sign(payload),
      },
      message: 'Đăng nhập thành công',
    };
  }

  async getAdminById(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: adminPassword, ...result } = admin;
    return {
      status: 200,
      data: result,
      message: 'Lấy thông tin admin thành công',
    };
  }
}
