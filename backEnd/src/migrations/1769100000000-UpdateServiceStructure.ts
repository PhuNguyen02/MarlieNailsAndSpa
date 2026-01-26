import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateServiceStructure1769100000000 implements MigrationInterface {
  name = 'UpdateServiceStructure1769100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns for flexible pricing
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`priceType\` enum ('single', 'range', 'package', 'custom') NOT NULL DEFAULT 'single'`,
    );
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`singlePrice\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`priceRangeMin\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`priceRangeMax\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`packagePrice\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`packageSessions\` int NULL`);

    // Add service details columns
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`duration\` varchar(50) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`steps\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`stepsCount\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` ADD \`zone\` varchar(100) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`hasCustomDesign\` tinyint NOT NULL DEFAULT 0`,
    );

    // Make legacy fields nullable
    await queryRunner.query(`ALTER TABLE \`services\` MODIFY \`basePrice\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` MODIFY \`durationMinutes\` int NULL`);

    // Migrate existing data: copy basePrice to singlePrice
    await queryRunner.query(
      `UPDATE \`services\` SET \`singlePrice\` = \`basePrice\`, \`priceType\` = 'single' WHERE \`basePrice\` IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: make basePrice and durationMinutes NOT NULL again
    await queryRunner.query(`ALTER TABLE \`services\` MODIFY \`basePrice\` decimal(10,2) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`services\` MODIFY \`durationMinutes\` int NOT NULL`);

    // Drop new columns
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`hasCustomDesign\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`zone\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`stepsCount\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`steps\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`duration\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`packageSessions\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`packagePrice\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`priceRangeMax\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`priceRangeMin\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`singlePrice\``);
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`priceType\``);
  }
}
