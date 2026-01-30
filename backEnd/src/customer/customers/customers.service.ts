import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if email or phone already exists
    const whereConditions: any[] = [{ phone: createCustomerDto.phone }];
    if (createCustomerDto.email) {
      whereConditions.push({ email: createCustomerDto.email });
    }

    const existing = await this.customerRepository.findOne({
      where: whereConditions,
    });

    if (existing) {
      throw new ConflictException('Email hoặc số điện thoại đã tồn tại');
    }

    const customer = this.customerRepository.create(createCustomerDto);
    const saved = await this.customerRepository.save(customer);
    return {
      status: 200,
      data: saved,
      message: 'Tạo khách hàng thành công',
    };
  }

  async findAll() {
    const customers = await this.customerRepository.find({
      order: { createdAt: 'DESC' },
    });
    return {
      status: 200,
      data: customers,
      message: 'Lấy danh sách khách hàng thành công',
    };
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });

    if (!customer) {
      throw new NotFoundException(`Khách hàng với ID ${id} không tồn tại`);
    }

    return customer;
  }

  async findOneFormatted(id: string) {
    const customer = await this.findOne(id);
    return {
      status: 200,
      data: customer,
      message: 'Lấy thông tin khách hàng thành công',
    };
  }

  async findByEmail(email: string) {
    return this.customerRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string) {
    const customer = await this.customerRepository.findOne({ where: { phone } });
    return {
      status: 200,
      data: customer,
      message: customer ? 'Tìm thấy khách hàng' : 'Không tìm thấy khách hàng',
    };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    const updated = await this.customerRepository.save(customer);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật khách hàng thành công',
    };
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
    return {
      status: 200,
      data: {},
      message: 'Xóa khách hàng thành công',
    };
  }

  async updateStats(customerId: string, totalSpent: number) {
    const customer = await this.findOne(customerId);
    customer.totalVisits += 1;
    customer.totalSpent += totalSpent;
    return this.customerRepository.save(customer);
  }
}
