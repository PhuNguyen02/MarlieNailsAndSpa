// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Admin,
  Service,
  Treatment,
  Employee,
  EmployeeSchedule,
  Customer,
  TimeSlot,
  Booking,
  BookingEmployee,
  BookingNotification,
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  MediaFile,
  ContactMessage,
  Promotion,
  Testimonial,
  Banner,
  HomepageSection,
} from './entities';
import { AuthModule } from './admin/auth/auth.module';
import { ServicesModule } from './admin/services/services.module';
import { TimeSlotsModule } from './admin/time-slots/time-slots.module';
import { EmployeesModule } from './admin/employees/employees.module';
import { CustomersModule } from './customer/customers/customers.module';
import { BookingsModule } from './customer/bookings/bookings.module';
import { EmployeeSchedulesModule } from './admin/employee-schedules/employee-schedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicServicesModule } from './customer/services/services.module';
import { AdminBlogModule } from './admin/blog/blog.module';
import { PublicBlogModule } from './customer/blog/blog.module';
import { ContactModule } from './customer/contact/contact.module';
import { AdminContactModule } from './admin/contact/admin-contact.module';
import { PromotionsModule } from './admin/promotions/promotions.module';
import { TestimonialsModule } from './admin/testimonials/testimonials.module';
import { CustomerAuthModule } from './customer/auth/customer-auth.module';
import { CustomerProfileModule } from './customer/profile/customer-profile.module';
import { HomepageModule } from './admin/homepage/homepage.module';
import { BannersModule } from './admin/banners/banners.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';

// Import migrations
import { InitialSchema1768831183415 } from './migrations/1768831183415-InitialSchema';
import { CreateBookingEmployeesTable1769005813189 } from './migrations/1769005813189-CreateBookingEmployeesTable';
import { CreateCMSTables1769008354276 } from './migrations/1769008354276-CreateCMSTables';
import { UpdateServiceStructure1769100000000 } from './migrations/1769100000000-UpdateServiceStructure';
import { CreateEmployeeSchedulesTable1769200000000 } from './migrations/1769200000000-CreateEmployeeSchedulesTable';
import { AddBannersTable1773430803218 } from './migrations/1773430803218-AddBannersTable';
import { CreateHomepageSectionsTable1773432000000 } from './migrations/1773432000001-CreateHomepageSectionsTable';
import { AddHomepageSectionTypes1773432000002 } from './migrations/1773432000002-AddHomepageSectionTypes';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Admin,
          Service,
          Treatment,
          Employee,
          EmployeeSchedule,
          Customer,
          TimeSlot,
          Booking,
          BookingEmployee,
          BookingNotification,
          BlogPost,
          BlogCategory,
          BlogTag,
          BlogComment,
          MediaFile,
          ContactMessage,
          Promotion,
          Testimonial,
          Banner,
          HomepageSection,
        ],
        migrations: [
          InitialSchema1768831183415,
          CreateBookingEmployeesTable1769005813189,
          CreateCMSTables1769008354276,
          UpdateServiceStructure1769100000000,
          CreateEmployeeSchedulesTable1769200000000,
          AddBannersTable1773430803218,
          CreateHomepageSectionsTable1773432000000,
          AddHomepageSectionTypes1773432000002,
        ],
        synchronize: false,
        logging: true,
        charset: 'utf8mb4',
      }),
    }),

    // Feature Modules
    AuthModule,
    ServicesModule,
    TimeSlotsModule,
    EmployeesModule,
    CustomersModule,
    BookingsModule,
    EmployeeSchedulesModule,
    NotificationsModule,
    PublicServicesModule,

    // Blog Modules
    AdminBlogModule,
    PublicBlogModule,
    ContactModule,
    AdminContactModule,
    PromotionsModule,
    TestimonialsModule,
    CustomerAuthModule,
    CustomerProfileModule,

    // Additional Admin Modules
    HomepageModule,
    BannersModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
