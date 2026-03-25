import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHomepageSectionTypes1773432000002 implements MigrationInterface {
  name = 'AddHomepageSectionTypes1773432000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`homepage_sections\` MODIFY COLUMN \`type\` enum('hero', 'services', 'usp', 'promotion', 'blog', 'about', 'wellness', 'working_hours', 'pricing', 'testimonials', 'custom') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`homepage_sections\` MODIFY COLUMN \`type\` enum('hero', 'services', 'usp', 'promotion', 'blog', 'about', 'custom') NOT NULL`,
    );
  }
}
