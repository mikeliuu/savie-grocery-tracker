import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationEntity } from './location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), AccountsModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
