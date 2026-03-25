import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBannersTable1773430803218 implements MigrationInterface {
    name = 'AddBannersTable1773430803218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Banners table safely
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`banners\` (
            \`id\` varchar(36) NOT NULL, 
            \`title\` varchar(255) NOT NULL, 
            \`subtitle\` text NULL, 
            \`imageUrl\` varchar(255) NULL, 
            \`buttonText\` varchar(255) NULL, 
            \`buttonLink\` varchar(255) NULL, 
            \`displayOrder\` int NOT NULL DEFAULT '0', 
            \`isActive\` tinyint NOT NULL DEFAULT 1, 
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Try to add constraint, but ignore if it fails (might already exist)
        try {
            await queryRunner.query(`ALTER TABLE \`employee_schedules\` ADD CONSTRAINT \`FK_4d5b29c922b0411a2a6c9e7c206\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        } catch (e) {
            console.log('Note: FK_4d5b29c922b0411a2a6c9e7c206 might already exist.');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`ALTER TABLE \`employee_schedules\` DROP FOREIGN KEY \`FK_4d5b29c922b0411a2a6c9e7c206\``);
        } catch (e) {}
        await queryRunner.query(`DROP TABLE IF EXISTS \`banners\``);
    }

}
