import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHomepageSectionsTable1773432000000 implements MigrationInterface {
    name = 'CreateHomepageSectionsTable1773432000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`homepage_sections\` (
            \`id\` varchar(36) NOT NULL, 
            \`type\` enum('hero', 'services', 'usp', 'promotion', 'blog', 'about', 'wellness', 'working_hours', 'pricing', 'testimonials', 'custom') NOT NULL, 
            \`title\` varchar(255) NOT NULL, 
            \`subtitle\` text NULL, 
            \`content\` longtext NULL, 
            \`imageUrl\` varchar(255) NULL, 
            \`config\` json NULL, 
            \`displayOrder\` int NOT NULL DEFAULT '0', 
            \`isActive\` tinyint NOT NULL DEFAULT 1, 
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`homepage_sections\``);
    }

}
