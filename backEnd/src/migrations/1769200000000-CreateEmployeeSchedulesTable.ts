import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeSchedulesTable1769200000000 implements MigrationInterface {
  name = 'CreateEmployeeSchedulesTable1769200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng employee_schedules
    await queryRunner.query(`
      CREATE TABLE \`employee_schedules\` (
        \`id\` varchar(36) NOT NULL,
        \`employeeId\` varchar(36) NOT NULL,
        \`dayOfWeek\` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NULL,
        \`specificDate\` date NULL,
        \`startTime\` time NOT NULL,
        \`endTime\` time NOT NULL,
        \`breakStartTime\` time NULL,
        \`breakEndTime\` time NULL,
        \`isDayOff\` tinyint NOT NULL DEFAULT 0,
        \`note\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_employee_day_date\` (\`employeeId\`, \`dayOfWeek\`, \`specificDate\`),
        KEY \`FK_employee_schedule_employee\` (\`employeeId\`),
        CONSTRAINT \`FK_employee_schedule_employee\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    console.log('✅ Created employee_schedules table');

    // Thêm index cho truy vấn theo ngày
    await queryRunner.query(`
      CREATE INDEX \`IDX_schedule_day_of_week\` ON \`employee_schedules\` (\`dayOfWeek\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_schedule_specific_date\` ON \`employee_schedules\` (\`specificDate\`)
    `);

    await queryRunner.query(`
      CREATE INDEX \`IDX_schedule_is_day_off\` ON \`employee_schedules\` (\`isDayOff\`)
    `);

    console.log('✅ Created indexes on employee_schedules');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa indexes
    await queryRunner.query(`DROP INDEX \`IDX_schedule_is_day_off\` ON \`employee_schedules\``);
    await queryRunner.query(`DROP INDEX \`IDX_schedule_specific_date\` ON \`employee_schedules\``);
    await queryRunner.query(`DROP INDEX \`IDX_schedule_day_of_week\` ON \`employee_schedules\``);

    // Xóa bảng
    await queryRunner.query(`DROP TABLE \`employee_schedules\``);

    console.log('✅ Dropped employee_schedules table');
  }
}
