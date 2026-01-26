import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingEmployeesTable1769005813189 implements MigrationInterface {
    name = 'CreateBookingEmployeesTable1769005813189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`booking_employees\` (\`id\` varchar(36) NOT NULL, \`bookingId\` varchar(255) NOT NULL, \`employeeId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`booking_employees\` ADD CONSTRAINT \`FK_ed4f7e96a88e7334f982a09e7f5\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking_employees\` ADD CONSTRAINT \`FK_774630488869142984b583a19fd\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking_employees\` DROP FOREIGN KEY \`FK_774630488869142984b583a19fd\``);
        await queryRunner.query(`ALTER TABLE \`booking_employees\` DROP FOREIGN KEY \`FK_ed4f7e96a88e7334f982a09e7f5\``);
        await queryRunner.query(`DROP TABLE \`booking_employees\``);
    }

}
