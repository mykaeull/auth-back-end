import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scheduling } from 'src/entities/scheduling.entity';
import { FindOptionsWhere, ILike, Repository, In } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { PaginatedResponseType } from 'src/common/types/paginated-response.type';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateSchedulingDto, userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(data.date);
    selectedDate.setDate(selectedDate.getDate() + 1);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new Error('Não é possível agendar para datas anteriores à atual.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const amount = data.type === 'corte' ? 30 : data.type === 'barba' ? 15 : 40;

    const paid = data.payment_method === 'pix';

    const scheduling = this.schedulingRepository.create({
      ...data,
      amount,
      paid,
      user,
    });

    return await this.schedulingRepository.save(scheduling);
  }

  async findAllPaginated(
    page = 1,
    pageSize = 10,
    userId: number,
    filters?: Omit<Partial<Scheduling>, 'paid' | 'type' | 'payment_method'> & {
      paid?: 'pago' | 'nao_pago';
      type?: string; // vem como 'barba,corte'
      payment_method?: string; // vem como 'pix,espécie'
    },
  ): Promise<PaginatedResponseType<Scheduling>> {
    const skip = (page - 1) * pageSize;

    const where: FindOptionsWhere<Scheduling> = {
      user: { id: userId },
    };

    if (filters?.name) {
      where.name = ILike(`%${filters.name}%`);
    }
    if (filters?.date) {
      where.date = filters.date;
    }
    if (filters?.payment_method) {
      const methods = filters.payment_method.split(
        ',',
      ) as Scheduling['payment_method'][];
      where.payment_method = In(methods);
    }
    if (filters?.type) {
      const types = filters.type
        .split(',')
        .map((t) =>
          t === 'corteEbarba' ? 'corte&barba' : t,
        ) as Scheduling['type'][];
      where.type = In(types);
    }
    if (filters?.paid === 'pago') {
      where.paid = true;
    } else if (filters?.paid === 'nao_pago') {
      where.paid = false;
    }

    const [items, itemsTotal] = await this.schedulingRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { date: 'DESC', time: 'ASC' },
    });

    return {
      items,
      itemsTotal,
      page,
      pageSize,
    };
  }

  async getAvailableTimes(date: string, userId: number): Promise<string[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return []; // validação básica
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (date < todayStr) {
      return []; // bloqueia datas anteriores
    }

    const isToday = date === todayStr;

    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();

    const agendamentos = await this.schedulingRepository.find({
      where: {
        date,
        user: { id: userId },
      },
    });

    const horariosIndisponiveis = agendamentos.map((ag) => ag.time);

    const horariosDisponiveis: string[] = [];
    const [openHour, closeHour] = [9, 19]; // 09:00 até 19:00

    for (let hour = openHour; hour <= closeHour; hour++) {
      const horaCheia = `${String(hour).padStart(2, '0')}:00`;
      const meiaHora = `${String(hour).padStart(2, '0')}:30`;

      if (
        !isToday ||
        hour > currentHour ||
        (hour === currentHour && currentMinutes < 30)
      ) {
        if (!horariosIndisponiveis.includes(horaCheia)) {
          horariosDisponiveis.push(horaCheia);
        }
      }

      if (
        !isToday ||
        hour > currentHour ||
        (hour === currentHour && currentMinutes < 0)
      ) {
        if (!horariosIndisponiveis.includes(meiaHora)) {
          horariosDisponiveis.push(meiaHora);
        }
      }
    }

    return horariosDisponiveis;
  }

  async markAsPaid(id: number, userId: number) {
    const scheduling = await this.schedulingRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!scheduling) {
      throw new Error(
        'Agendamento não encontrado ou não pertence ao usuário logado.',
      );
    }

    if (scheduling.paid) {
      return { message: 'Este agendamento já está marcado como pago.' };
    }

    scheduling.paid = true;
    await this.schedulingRepository.save(scheduling);

    return { message: 'Status atualizado para pago com sucesso.' };
  }
}
