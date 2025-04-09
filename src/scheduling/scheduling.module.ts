import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from 'src/entities/scheduling.entity';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduling])],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
