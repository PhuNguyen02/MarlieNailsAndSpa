import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1768831183415 implements MigrationInterface {
  name = 'InitialSchema1768831183415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`description\` text NULL, \`category\` varchar(100) NULL, \`basePrice\` decimal(10,2) NOT NULL, \`durationMinutes\` int NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`imageUrl\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`treatments\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`durationMinutes\` int NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`serviceId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NOT NULL, \`dateOfBirth\` date NULL, \`address\` text NULL, \`notes\` text NULL, \`totalVisits\` int NOT NULL DEFAULT '0', \`totalSpent\` decimal(10,2) NOT NULL DEFAULT '0.00', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8536b8b85c06969f84f0c098b0\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`employees\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NOT NULL, \`role\` enum ('therapist', 'receptionist', 'manager') NOT NULL DEFAULT 'therapist', \`specialization\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`workSchedule\` text NULL, \`hireDate\` date NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_765bc1ac8967533a04c74a9f6a\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`booking_notifications\` (\`id\` varchar(36) NOT NULL, \`bookingId\` varchar(255) NOT NULL, \`type\` enum ('booking_created', 'booking_confirmed', 'booking_reminder', 'booking_cancelled', 'booking_completed') NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`status\` enum ('pending', 'sent', 'failed', 'read') NOT NULL DEFAULT 'pending', \`recipientEmail\` text NULL, \`sentAt\` datetime NULL, \`readAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bookings\` (\`id\` varchar(36) NOT NULL, \`customerId\` varchar(255) NOT NULL, \`serviceId\` varchar(255) NULL, \`treatmentId\` varchar(255) NULL, \`employeeId\` varchar(255) NULL, \`bookingDate\` date NOT NULL, \`timeSlotId\` varchar(255) NOT NULL, \`numberOfGuests\` int NOT NULL DEFAULT '1', \`status\` enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'pending', \`totalPrice\` decimal(10,2) NOT NULL, \`notes\` text NULL, \`cancellationReason\` text NULL, \`cancelledAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`time_slots\` (\`id\` varchar(36) NOT NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`maxCapacity\` int NOT NULL DEFAULT '5', \`currentBookings\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admins\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`phone\` varchar(20) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`lastLogin\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\` (\`username\`), UNIQUE INDEX \`IDX_051db7d37d478a69a7432df147\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`treatments\` ADD CONSTRAINT \`FK_1e36940a1f8d2c3dfaa43aeaf6c\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_notifications\` ADD CONSTRAINT \`FK_d5c0fbfe0fa32d8c951126ff014\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_67b9cd20f987fc6dc70f7cd283f\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_15a2431ec10d29dcd96c9563b65\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_688009c786849275df552ca9de8\` FOREIGN KEY (\`treatmentId\`) REFERENCES \`treatments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5415b42a6b8fd5e640e1b81f89a\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_fb0e0598f0c94a35c9751520bbf\` FOREIGN KEY (\`timeSlotId\`) REFERENCES \`time_slots\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_fb0e0598f0c94a35c9751520bbf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5415b42a6b8fd5e640e1b81f89a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_688009c786849275df552ca9de8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_15a2431ec10d29dcd96c9563b65\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_67b9cd20f987fc6dc70f7cd283f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`booking_notifications\` DROP FOREIGN KEY \`FK_d5c0fbfe0fa32d8c951126ff014\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`treatments\` DROP FOREIGN KEY \`FK_1e36940a1f8d2c3dfaa43aeaf6c\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_051db7d37d478a69a7432df147\` ON \`admins\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4ba6d0c734d53f8e1b2e24b6c5\` ON \`admins\``,
    );
    await queryRunner.query(`DROP TABLE \`admins\``);
    await queryRunner.query(`DROP TABLE \`time_slots\``);
    await queryRunner.query(`DROP TABLE \`bookings\``);
    await queryRunner.query(`DROP TABLE \`booking_notifications\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_765bc1ac8967533a04c74a9f6a\` ON \`employees\``,
    );
    await queryRunner.query(`DROP TABLE \`employees\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8536b8b85c06969f84f0c098b0\` ON \`customers\``,
    );
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(`DROP TABLE \`treatments\``);
    await queryRunner.query(`DROP TABLE \`services\``);
  }
}
