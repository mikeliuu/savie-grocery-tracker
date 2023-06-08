import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export default function ormConfig(): TypeOrmModuleOptions | DataSourceOptions {
  const {
    DATABASE_TYPE,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    NODE_ENV,
  } = process.env;

  return {
    type: DATABASE_TYPE as any,
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: NODE_ENV === 'development',
    logging: true,
    autoLoadEntities: true,
  };
}
