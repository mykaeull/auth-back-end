import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Request } from 'express';

interface JwtPayload {
  userId: number;
  email: string;
}

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post(':userId')
  create(@Body() body: CreateSchedulingDto, @Param('userId') userId: string) {
    return this.schedulingService.create(body, +userId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAllPaginated(
    @Req() req: Request & { user: JwtPayload },
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('name') name?: string,
    @Query('date') date?: string,
    @Query('payment_method') payment_method?: 'pix' | 'espécie',
    @Query('type') type?: 'corte' | 'barba' | 'corteEbarba',
    @Query('paid') paid?: 'pago' | 'nao_pago',
  ) {
    const userId = req.user?.userId;

    return this.schedulingService.findAllPaginated(
      Number(page) || 1,
      Number(pageSize) || 10,
      userId,
      { name, date, payment_method, type, paid },
    );
  }

  @Get('available-times')
  getAvailableTimes(@Query('date') date: string) {
    return this.schedulingService.getAvailableTimes(date);
  }
}
