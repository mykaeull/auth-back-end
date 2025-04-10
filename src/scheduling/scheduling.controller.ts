import { Body, Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() body: CreateSchedulingDto) {
    return this.schedulingService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllPaginated(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('name') name?: string,
    @Query('date') date?: string,
    @Query('payment_method') payment_method?: 'pix' | 'espécie',
    @Query('type') type?: 'corte' | 'barba' | 'corteEbarba',
    @Query('paid') paid?: 'pago' | 'nao_pago',
  ) {
    return this.schedulingService.findAllPaginated(
      Number(page) || 1,
      Number(pageSize) || 10,
      { name, date, payment_method, type, paid },
    );
  }

  @Get('available-times')
  getAvailableTimes(@Query('date') date: string) {
    return this.schedulingService.getAvailableTimes(date);
  }
}
