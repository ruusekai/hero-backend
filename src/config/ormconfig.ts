import { join } from 'path';

export class OrmConfig {
  private readonly _config;

  constructor() {
    this._config = [
      {
        name: process.env.MYSQL_TYPEORM_NAME,
        type: process.env.MYSQL_TYPEORM_CONNECTION,
        host: process.env.MYSQL_TYPEORM_HOST,
        port: process.env.MYSQL_TYPEORM_PORT,
        username: process.env.MYSQL_TYPEORM_USERNAME,
        password: process.env.MYSQL_TYPEORM_PASSWORD,
        database: process.env.MYSQL_TYPEORM_DATABASE,
        logging: false,
        entities: [
          join(__dirname, '../database/mysql/entities', '*.entity.{ts,js}'),
        ],
        migrations: [
          join(__dirname, '../database/mysql/migration', '*.{ts,js}'),
        ],
        synchronize: false,
        connectTimeoutMS: 30000,
        migrationsRun: false,
        keepConnectionAlive: true,
      },
      {
        name: process.env.MONGO_TYPEORM_NAME,
        type: process.env.MONGO_TYPEORM_CONNECTION,
        host: process.env.MONGO_TYPEORM_HOST,
        port: process.env.MYSQL_TYPEORM_PORT,
        username: process.env.MONGO_TYPEORM_USERNAME,
        password: process.env.MONGO_TYPEORM_PASSWORD,
        database: process.env.MONGO_TYPEORM_DATABASE,
        logging: false,
        entities: ['dist/database/mongodb/entities/*.entity{.ts,.js}'],
        synchronize: false,
        connectTimeoutMS: 30000,
        migrationsRun: false,
        keepConnectionAlive: true,
      },
    ];
  }
  get config(): any {
    return this._config;
  }
}
