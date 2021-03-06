import { MigrationInterface, QueryRunner } from 'typeorm';

export class initTaskTables1642740695509 implements MigrationInterface {
  name = 'initTaskTables1642740695509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP FOREIGN KEY \`district_region_id_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP FOREIGN KEY \`region_country_id_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP FOREIGN KEY \`file_thumbnail_file_uuid_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP FOREIGN KEY \`user_basic_auth_user_uuid_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP FOREIGN KEY \`user_kyc_user_uuid_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP FOREIGN KEY \`user_oauth_facebook_user_uuid_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP FOREIGN KEY \`user_oauth_google_user_uuid_fk\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP FOREIGN KEY \`user_profile_user_uuid_fk\``,
    );
    await queryRunner.query(`DROP INDEX \`file_uuid_uindex\` ON \`file\``);
    await queryRunner.query(`DROP INDEX \`user_uuid_uindex\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`user_kyc_uindex\` ON \`user_kyc\``);
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`record_state\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`country\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`is_deleted\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`created_by\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updated_by\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`uuid\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD UNIQUE INDEX \`IDX_d85c96c207a7395158a68ee126\` (\`uuid\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`full_path\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`full_path\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`original_filename\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`original_filename\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`filename\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`filename\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`full_path\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`full_path\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_deleted\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_by\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_by\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`uuid\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`mobile\` \`mobile\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` (\`mobile\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_boss\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_boss\` tinyint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_hero\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_hero\` tinyint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_kyc\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_kyc\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`last_login_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`last_login_date\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`last_login_ip\` \`last_login_ip\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`lang\` \`lang\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD UNIQUE INDEX \`IDX_006d27d160b9f2b6fb3beb8179\` (\`user_uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`username\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`username\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`password\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`password\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(`ALTER TABLE \`user_kyc\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`uuid\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD UNIQUE INDEX \`IDX_939b44fc37d34ee0fc650f0127\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`full_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`full_name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` CHANGE \`decline_reason\` \`decline_reason\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`admin_remarks\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`admin_remarks\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`facebook_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`facebook_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`sub\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`sub\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`email_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`email_verified\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`picture\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`picture\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`given_name\` \`given_name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`family_name\` \`family_name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`locale\` \`locale\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`nonce\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`nonce\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`expiry_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`expiry_date\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD UNIQUE INDEX \`IDX_3091c6f070e3baf83e73566cef\` (\`user_uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`icon\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`icon\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`self_introduction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`self_introduction\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` CHANGE \`version\` \`version\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`created_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`updated_by\` varchar(255) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`expiry_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`expiry_date\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_006d27d160b9f2b6fb3beb8179\` ON \`user_basic_auth\` (\`user_uuid\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_3091c6f070e3baf83e73566cef\` ON \`user_profile\` (\`user_uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD CONSTRAINT \`FK_006d27d160b9f2b6fb3beb8179e\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD CONSTRAINT \`FK_9ffd58b06b4fe41be462947e2ca\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD CONSTRAINT \`FK_3091c6f070e3baf83e73566cef8\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP FOREIGN KEY \`FK_3091c6f070e3baf83e73566cef8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP FOREIGN KEY \`FK_9ffd58b06b4fe41be462947e2ca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP FOREIGN KEY \`FK_006d27d160b9f2b6fb3beb8179e\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_3091c6f070e3baf83e73566cef\` ON \`user_profile\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_006d27d160b9f2b6fb3beb8179\` ON \`user_basic_auth\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`expiry_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`expiry_date\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`token\` varchar(6) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sms_token\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`self_introduction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`self_introduction\` varchar(5000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`icon\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`icon\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP INDEX \`IDX_3091c6f070e3baf83e73566cef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`expiry_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`expiry_date\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`nonce\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`nonce\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_login_nonce\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`locale\` \`locale\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`family_name\` \`family_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`given_name\` \`given_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`picture\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`picture\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`name\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`email_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`email_verified\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`email\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`sub\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`sub\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`name\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`email\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`facebook_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`facebook_id\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`admin_remarks\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`admin_remarks\` varchar(5000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` CHANGE \`decline_reason\` \`decline_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`full_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`full_name\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP INDEX \`IDX_939b44fc37d34ee0fc650f0127\``,
    );
    await queryRunner.query(`ALTER TABLE \`user_kyc\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`uuid\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`password\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`password\` varchar(5000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`username\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`username\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP INDEX \`IDX_006d27d160b9f2b6fb3beb8179\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`lang\` \`lang\` varchar(255) NOT NULL DEFAULT 'tc'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`last_login_ip\` \`last_login_ip\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`last_login_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`last_login_date\` timestamp NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_kyc\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_kyc\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_hero\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_hero\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_boss\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_boss\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`name\` varchar(1000) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`email\` varchar(1000) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`mobile\` \`mobile\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`uuid\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_by\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_by\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_deleted\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`full_path\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`full_path\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`filename\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`filename\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`original_filename\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`original_filename\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`full_path\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`full_path\` varchar(1000) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP INDEX \`IDX_d85c96c207a7395158a68ee126\``,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`uuid\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`uuid\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`updated_by\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`created_by\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`is_deleted\``);
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`country\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`name\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`updated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`updated_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`created_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`created_by\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`updated_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`updated_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`created_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`created_date\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` DROP COLUMN \`is_deleted\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`is_deleted\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD \`record_state\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`user_kyc_uindex\` ON \`user_kyc\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`user_uuid_uindex\` ON \`user\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`file_uuid_uindex\` ON \`file\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_profile\` ADD CONSTRAINT \`user_profile_user_uuid_fk\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_google\` ADD CONSTRAINT \`user_oauth_google_user_uuid_fk\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_oauth_facebook\` ADD CONSTRAINT \`user_oauth_facebook_user_uuid_fk\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_kyc\` ADD CONSTRAINT \`user_kyc_user_uuid_fk\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_basic_auth\` ADD CONSTRAINT \`user_basic_auth_user_uuid_fk\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`user\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_thumbnail\` ADD CONSTRAINT \`file_thumbnail_file_uuid_fk\` FOREIGN KEY (\`file_uuid\`) REFERENCES \`file\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_region\` ADD CONSTRAINT \`region_country_id_fk\` FOREIGN KEY (\`country_id\`) REFERENCES \`country\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`country_district\` ADD CONSTRAINT \`district_region_id_fk\` FOREIGN KEY (\`region_id\`) REFERENCES \`country_region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
