import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../../entities/customer.entity';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CustomerRegisterDto) {
    const { phone, password, fullName, email } = registerDto;

    // 1. Kiểm tra xem khách hàng đã tồn tại chưa (theo SĐT)
    let customer = await this.customerRepository.findOne({ where: { phone } });

    if (customer) {
      // Nếu đã có password tức là đã đăng ký rồi
      // Ta cần load cả password vì mặc định ta set select: false
      const customerWithPass = await this.customerRepository.findOne({
        where: { id: customer.id },
        select: ['id', 'password'],
      });

      if (customerWithPass?.password) {
        throw new ConflictException('Số điện thoại này đã được đăng ký tài khoản');
      }

      // Nếu chưa có password: Đây là "Shadow Profile" từ lần booking trước
      // Cập nhật thông tin đăng ký vào bản ghi cũ
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
      customer.fullName = fullName;
      if (email) customer.email = email;

      await this.customerRepository.save(customer);
    } else {
      // 2. Nếu chưa tồn tại khách hàng này: Tạo mới hoàn toàn
      const hashedPassword = await bcrypt.hash(password, 10);
      customer = this.customerRepository.create({
        phone,
        password: hashedPassword,
        fullName,
        email,
      });
      await this.customerRepository.save(customer);
    }

    // 3. Tạo JWT token
    const payload = { sub: customer.id, phone: customer.phone, role: 'customer' };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = customer;

    return {
      status: 200,
      data: {
        ...result,
        access_token: this.jwtService.sign(payload),
      },
      message: 'Đăng ký tài khoản thành công',
    };
  }

  async login(loginDto: CustomerLoginDto) {
    const { phone, password } = loginDto;

    // Tìm khách hàng kèm password (vì select: false)
    const customer = await this.customerRepository.findOne({
      where: { phone },
      select: ['id', 'phone', 'fullName', 'email', 'password', 'isActive', 'role'],
    });

    if (!customer || !customer.password) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác');
    }

    if (!customer.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác');
    }

    const payload = { sub: customer.id, phone: customer.phone, role: customer.role || 'customer' };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = customer;

    return {
      status: 200,
      data: {
        ...result,
        access_token: this.jwtService.sign(payload),
      },
      message: 'Đăng nhập thành công',
    };
  }

  async validateCustomer(id: string) {
    const customer = await this.customerRepository.findOne({ where: { id, isActive: true } });
    if (!customer) return null;
    return customer;
  }
}
