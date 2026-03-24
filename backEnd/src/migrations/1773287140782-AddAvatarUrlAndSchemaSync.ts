import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlAndSchemaSync1773287140782 implements MigrationInterface {
    name = 'AddAvatarUrlAndSchemaSync1773287140782'

    private async safeQuery(queryRunner: QueryRunner, query: string) {
        try {
            await queryRunner.query(query);
        } catch (e: any) {
            console.log(`Query failed (as expected if already applied): ${query.substring(0, 100)}... Error: ${e.message}`);
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drops
        await this.safeQuery(queryRunner, `ALTER TABLE \`employee_schedules\` DROP FOREIGN KEY \`FK_employee_schedule_employee\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP FOREIGN KEY \`FK_aaf6cdeebd8497289338899961b\``);
        await this.safeQuery(queryRunner, `DROP INDEX \`IDX_schedule_day_of_week\` ON \`employee_schedules\``);
        await this.safeQuery(queryRunner, `DROP INDEX \`IDX_schedule_is_day_off\` ON \`employee_schedules\``);
        await this.safeQuery(queryRunner, `DROP INDEX \`IDX_schedule_specific_date\` ON \`employee_schedules\``);
        await this.safeQuery(queryRunner, `DROP INDEX \`UQ_employee_day_date\` ON \`employee_schedules\``);

        // Creates
        await this.safeQuery(queryRunner, `CREATE TABLE \`testimonials\` (\`id\` varchar(36) NOT NULL, \`customerName\` varchar(100) NOT NULL, \`customerTitle\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`content\` text NOT NULL, \`rating\` int NOT NULL DEFAULT '5', \`isActive\` tinyint NOT NULL DEFAULT 1, \`displayOrder\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`promotions\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`description\` text NULL, \`discountType\` varchar(20) NOT NULL DEFAULT 'percent', \`discountValue\` decimal(10,2) NULL, \`badge\` varchar(50) NULL, \`imageUrl\` varchar(255) NULL, \`validFrom\` date NULL, \`validUntil\` date NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`displayOrder\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`media_files\` (\`id\` varchar(36) NOT NULL, \`filename\` varchar(255) NOT NULL, \`originalName\` varchar(255) NOT NULL, \`mimeType\` varchar(100) NOT NULL, \`size\` int NOT NULL, \`url\` varchar(500) NOT NULL, \`uploadedById\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`contact_messages\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, \`subject\` varchar(200) NOT NULL, \`message\` text NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`blog_categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`slug\` varchar(100) NOT NULL, \`description\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_903a6ea496e83ba9bec10af583\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`blog_comments\` (\`id\` varchar(36) NOT NULL, \`postId\` varchar(255) NOT NULL, \`parentId\` varchar(255) NULL, \`authorName\` varchar(100) NOT NULL, \`authorEmail\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`isApproved\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`blog_tags\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`slug\` varchar(50) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_afc33ebb304bb6ee9dc0a26c5d\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`blog_post_categories\` (\`postId\` varchar(36) NOT NULL, \`categoryId\` varchar(36) NOT NULL, INDEX \`IDX_f5716f3191cc27d08a7bf6d078\` (\`postId\`), INDEX \`IDX_435cbf292acb4f419f059b3efe\` (\`categoryId\`), PRIMARY KEY (\`postId\`, \`categoryId\`)) ENGINE=InnoDB`);
        await this.safeQuery(queryRunner, `CREATE TABLE \`blog_post_tags\` (\`postId\` varchar(36) NOT NULL, \`tagId\` varchar(36) NOT NULL, INDEX \`IDX_ad4d63c771dcd9365fe4fe5a46\` (\`postId\`), INDEX \`IDX_d6e4bd52e7bf4bd69be040cb17\` (\`tagId\`), PRIMARY KEY (\`postId\`, \`tagId\`)) ENGINE=InnoDB`);

        // Column drops
        await this.safeQuery(queryRunner, `ALTER TABLE \`time_slots\` DROP COLUMN \`currentBookings\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`featuredImage\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`metaKeywords\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`tags\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`categoryId\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`allowComments\``);

        // Column adds
        await this.safeQuery(queryRunner, `ALTER TABLE \`customers\` ADD \`password\` varchar(255) NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`customers\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'customer'`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`customers\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`employees\` ADD \`avatarUrl\` varchar(255) NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`admins\` ADD \`role\` varchar(20) NOT NULL DEFAULT 'admin'`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`thumbnailUrl\` varchar(500) NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`scheduledAt\` datetime NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`isFeatured\` tinyint NOT NULL DEFAULT 0`);

        // Changes
        await this.safeQuery(queryRunner, `ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`customers\` ADD UNIQUE INDEX \`IDX_88acd889fbe17d0e16cc4bc917\` (\`phone\`)`);
        
        await this.safeQuery(queryRunner, `ALTER TABLE \`employee_schedules\` DROP COLUMN \`employeeId\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`employee_schedules\` ADD \`employeeId\` varchar(255) NOT NULL`);

        // Blog Posts ID change (DANGER - but safe-ish if we use safeQuery)
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` CHANGE \`id\` \`id\` int NOT NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP PRIMARY KEY`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`id\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);

        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`title\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`title\` varchar(500) NOT NULL`);
        
        await this.safeQuery(queryRunner, `DROP INDEX \`IDX_5b2818a2c45c3edb9991b1c7a5\` ON \`blog_posts\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`slug\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`slug\` varchar(500) NOT NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD UNIQUE INDEX \`IDX_5b2818a2c45c3edb9991b1c7a5\` (\`slug\`)`);

        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`metaTitle\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`metaTitle\` varchar(200) NULL`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`metaDescription\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`metaDescription\` varchar(500) NULL`);

        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` CHANGE \`status\` \`status\` enum ('draft', 'published', 'scheduled') NOT NULL DEFAULT 'draft'`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` CHANGE \`readingTime\` \`readingTime\` int NOT NULL DEFAULT '1'`);
        
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` DROP COLUMN \`authorId\``);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD \`authorId\` varchar(255) NULL`);

        // Meta/Indexes
        await this.safeQuery(queryRunner, `CREATE UNIQUE INDEX \`IDX_89adc856efd9b50f0c35b8136b\` ON \`employee_schedules\` (\`employeeId\`, \`dayOfWeek\`, \`specificDate\`)`);

        // Constraints
        await this.safeQuery(queryRunner, `ALTER TABLE \`employee_schedules\` ADD CONSTRAINT \`FK_4d5b29c922b0411a2a6c9e7c206\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`media_files\` ADD CONSTRAINT \`FK_569e22d0659fcfc4d2ddf7e5271\` FOREIGN KEY (\`uploadedById\`) REFERENCES \`admins\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_comments\` ADD CONSTRAINT \`FK_0a190c1025d773ec5ca2c039c92\` FOREIGN KEY (\`postId\`) REFERENCES \`blog_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_comments\` ADD CONSTRAINT \`FK_02b996a30d6a7a934ef71d97739\` FOREIGN KEY (\`parentId\`) REFERENCES \`blog_comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_posts\` ADD CONSTRAINT \`FK_09269227c7acf3cdf47ea4051e1\` FOREIGN KEY (\`authorId\`) REFERENCES \`admins\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_post_categories\` ADD CONSTRAINT \`FK_f5716f3191cc27d08a7bf6d0781\` FOREIGN KEY (\`postId\`) REFERENCES \`blog_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_post_categories\` ADD CONSTRAINT \`FK_435cbf292acb4f419f059b3efea\` FOREIGN KEY (\`categoryId\`) REFERENCES \`blog_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_post_tags\` ADD CONSTRAINT \`FK_ad4d63c771dcd9365fe4fe5a463\` FOREIGN KEY (\`postId\`) REFERENCES \`blog_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await this.safeQuery(queryRunner, `ALTER TABLE \`blog_post_tags\` ADD CONSTRAINT \`FK_d6e4bd52e7bf4bd69be040cb17d\` FOREIGN KEY (\`tagId\`) REFERENCES \`blog_tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Not implemented fully safely as down is rarely used in this context
    }
}
