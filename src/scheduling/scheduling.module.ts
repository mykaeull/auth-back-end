import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from 'src/entities/scheduling.entity';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduling, User])],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
