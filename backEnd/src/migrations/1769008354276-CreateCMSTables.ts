import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCMSTables1769008354276 implements MigrationInterface {
    name = 'CreateCMSTables1769008354276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalName\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NOT NULL, \`size\` bigint NOT NULL, \`path\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`type\` enum ('image', 'video', 'document', 'other') NOT NULL DEFAULT 'other', \`alt\` varchar(255) NULL, \`caption\` text NULL, \`width\` int NULL, \`height\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`excerpt\` text NULL, \`featuredImage\` varchar(255) NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`metaTitle\` varchar(255) NULL, \`metaDescription\` text NULL, \`metaKeywords\` text NULL, \`tags\` text NULL, \`categoryId\` int NULL, \`authorId\` int NULL, \`readingTime\` int NOT NULL DEFAULT '0', \`publishedAt\` datetime NULL, \`viewCount\` int NOT NULL DEFAULT '0', \`allowComments\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5b2818a2c45c3edb9991b1c7a5\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`content_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d6aaf8517ca57297a8c3a44d3d\` (\`name\`), UNIQUE INDEX \`IDX_3ccfa5937c762b2c4fdc60ee09\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`content_pages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`excerpt\` text NULL, \`featuredImage\` varchar(255) NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`metaTitle\` varchar(255) NULL, \`metaDescription\` text NULL, \`metaKeywords\` text NULL, \`categoryId\` int NULL, \`authorId\` int NULL, \`publishedAt\` datetime NULL, \`viewCount\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cc23a46df001843d70d6c3c650\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog_posts\` ADD CONSTRAINT \`FK_aaf6cdeebd8497289338899961b\` FOREIGN KEY (\`categoryId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_pages\` ADD CONSTRAINT \`FK_da34f13dfa7c087b336035908a9\` FOREIGN KEY (\`categoryId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content_pages\` DROP FOREIGN KEY \`FK_da34f13dfa7c087b336035908a9\``);
        await queryRunner.query(`ALTER TABLE \`blog_posts\` DROP FOREIGN KEY \`FK_aaf6cdeebd8497289338899961b\``);
        await queryRunner.query(`DROP INDEX \`IDX_cc23a46df001843d70d6c3c650\` ON \`content_pages\``);
        await queryRunner.query(`DROP TABLE \`content_pages\``);
        await queryRunner.query(`DROP INDEX \`IDX_3ccfa5937c762b2c4fdc60ee09\` ON \`content_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_d6aaf8517ca57297a8c3a44d3d\` ON \`content_categories\``);
        await queryRunner.query(`DROP TABLE \`content_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_5b2818a2c45c3edb9991b1c7a5\` ON \`blog_posts\``);
        await queryRunner.query(`DROP TABLE \`blog_posts\``);
        await queryRunner.query(`DROP TABLE \`media\``);
    }

}
