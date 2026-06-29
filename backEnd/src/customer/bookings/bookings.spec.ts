import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { BookingEmployee } from '../../entities/booking-employee.entity';
import { Employee } from '../../entities/employee.entity';
import { Service as ServiceEntity } from '../../entities/service.entity';
import { BookingNotification } from '../../entities/booking-notification.entity';
import { TimeSlotsService } from '../../admin/time-slots/time-slots.service';
import { CustomersService } from '../customers/customers.service';
import { EmployeeSchedulesService } from '../../admin/employee-schedules/employee-schedules.service';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

describe('BookingsService - Optional Staff', () => {
  let service: BookingsService;
  let bookingRepository: Repository<Booking>;
  let customersService: CustomersService;
  let timeSlotsService: TimeSlotsService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockEmployeeRepository = {
    findOne: jest.fn(),
  };
  const mockBookingEmployeeRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockServiceRepository = {
    findOne: jest.fn(),
  };
  const mockTimeSlotsService = {
    findOne: jest.fn(),
    findActive: jest.fn(),
  };
  const mockCustomersService = {
    findOne: jest.fn(),
  };
  const mockEmployeeSchedulesService = {
    getAvailableEmployees: jest.fn(),
  };
  const mockNotificationsGateway = {
    sendBookingNotification: jest.fn(),
  };

  const mockEntityManager = {
    create: jest.fn((entityClass, data) => data),
    save: jest.fn((entityClass, data) => Promise.resolve({ id: 'new-booking-id', ...data })),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      setLock: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockDataSource = {
    transaction: jest.fn((cb) => cb(mockEntityManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepository },
        { provide: getRepositoryToken(BookingNotification), useValue: mockNotificationRepository },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepository },
        { provide: getRepositoryToken(BookingEmployee), useValue: mockBookingEmployeeRepository },
        { provide: getRepositoryToken(ServiceEntity), useValue: mockServiceRepository },
        { provide: TimeSlotsService, useValue: mockTimeSlotsService },
        { provide: CustomersService, useValue: mockCustomersService },
        { provide: EmployeeSchedulesService, useValue: mockEmployeeSchedulesService },
        { provide: DataSource, useValue: mockDataSource },
        { provide: NotificationsGateway, useValue: mockNotificationsGateway },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    customersService = module.get<CustomersService>(CustomersService);
    timeSlotsService = module.get<TimeSlotsService>(TimeSlotsService);
  });

  it('should create a booking successfully without employeeIds (staff selection skipped)', async () => {
    const createBookingDto = {
      customerId: 'customer-uuid-1',
      bookingDate: '2026-07-01',
      timeSlotId: 'timeslot-uuid-1',
      numberOfGuests: 1,
      totalPrice: 150000,
      serviceId: 'service-uuid-1',
      employeeIds: [], // Empty or omitted staff
    };

    mockCustomersService.findOne.mockResolvedValue({ id: 'customer-uuid-1', email: 'test@example.com' });
    mockTimeSlotsService.findOne.mockResolvedValue({ id: 'timeslot-uuid-1', maxCapacity: 10, isActive: true });

    // mock checkAvailability in service manually or mock bookingRepository.find for availability check
    mockBookingRepository.find = jest.fn().mockResolvedValue([]); // 0 bookings in this slot -> 10 available

    mockEntityManager.findOne
      .mockImplementationOnce(() => Promise.resolve(null)) // customer double booking check -> null (no conflict)
      .mockImplementationOnce(() => Promise.resolve({
        id: 'new-booking-id',
        customer: { email: 'test@example.com' },
        bookingEmployees: [],
      })); // final return query

    const result = await service.create(createBookingDto);

    expect(result.status).toBe(200);
    expect(result.data!.id).toBe('new-booking-id');
    expect(mockEntityManager.create).toHaveBeenCalledWith(Booking, expect.objectContaining({
      customerId: 'customer-uuid-1',
      timeSlotId: 'timeslot-uuid-1',
      numberOfGuests: 1,
      totalPrice: 150000,
    }));
    // No employee-booking relation should be created
    expect(mockEntityManager.create).not.toHaveBeenCalledWith(BookingEmployee, expect.any(Object));
  });
});
