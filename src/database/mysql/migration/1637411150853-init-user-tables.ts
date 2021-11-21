import { MigrationInterface, QueryRunner } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';

export class initUserTables1637411150853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Create Tables Migration - Start');
    const create_database_sql_buff = await fs.readFile(
      path.resolve(__dirname, 'sql', '1637411150853-init-user-tables.sql'),
    );
    await queryRunner.query(create_database_sql_buff.toString('utf8'));
    console.log('Create Tables - Finished');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
