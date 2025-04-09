import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scheduling } from 'src/entities/scheduling.entity';
import { Repository } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>,
  ) {}

  async create(data: CreateSchedulingDto) {
    const amount = data.type === 'corte' ? 30 : data.type === 'barba' ? 15 : 40;

    const paid = data.payment_method === 'pix';

    const scheduling = this.schedulingRepository.create({
      ...data,
      amount,
      paid,
    });

    return await this.schedulingRepository.save(scheduling);
  }

  async getAvailableTimes(date: string): Promise<string[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return []; // validação básica
    }

    const agendamentos = await this.schedulingRepository.find({
      where: { date },
    });

    const horariosIndisponiveis = agendamentos.map((ag) => ag.time);

    const horariosDisponiveis: string[] = [];

    const [openHour, closeHour] = [9, 19]; // 09:00 até 19:00

    for (let hour = openHour; hour < closeHour; hour++) {
      horariosDisponiveis.push(`${String(hour).padStart(2, '0')}:00`);
      horariosDisponiveis.push(`${String(hour).padStart(2, '0')}:30`);
    }
    horariosDisponiveis.push('19:00'); // inclui 19:00

    return horariosDisponiveis.filter(
      (hora) => !horariosIndisponiveis.includes(hora),
    );
  }
}
