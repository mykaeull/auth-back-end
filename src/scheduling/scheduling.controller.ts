import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() body: CreateSchedulingDto) {
    return this.schedulingService.create(body);
  }

  @Get('available-times')
  getAvailableTimes(@Query('date') date: string) {
    return this.schedulingService.getAvailableTimes(date);
  }
}
