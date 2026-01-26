import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    const saved = await this.serviceRepository.save(service);
    return {
      status: 200,
      data: saved,
      message: 'Tạo dịch vụ thành công',
    };
  }

  async findAll() {
    const services = await this.serviceRepository.find({
      relations: ['treatments'],
      order: { createdAt: 'DESC' },
    });
    return {
      status: 200,
      data: services,
      message: 'Lấy danh sách dịch vụ thành công',
    };
  }

  async findActive() {
    const services = await this.serviceRepository.find({
      where: { isActive: true },
      relations: ['treatments'],
      order: { name: 'ASC' },
    });
    return {
      status: 200,
      data: services,
      message: 'Lấy danh sách dịch vụ đang hoạt động thành công',
    };
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['treatments'],
    });

    if (!service) {
      throw new NotFoundException(`Dịch vụ với ID ${id} không tồn tại`);
    }

    return service;
  }

  async findOneFormatted(id: string) {
    const service = await this.findOne(id);
    return {
      status: 200,
      data: service,
      message: 'Lấy thông tin dịch vụ thành công',
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    const updated = await this.serviceRepository.save(service);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật dịch vụ thành công',
    };
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
    return {
      status: 200,
      data: {},
      message: 'Xóa dịch vụ thành công',
    };
  }
}
