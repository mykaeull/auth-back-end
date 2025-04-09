import { IsDateString, IsEnum, IsString, Matches } from 'class-validator';

export class CreateSchedulingDto {
  @IsString()
  name: string;

  @IsString()
  contact: string;

  @IsEnum(['corte', 'barba', 'corte&barba'])
  type: 'corte' | 'barba' | 'corte&barba';

  @IsDateString()
  date: string;

  @Matches(/^\\d{2}:\\d{2}$/, { message: 'Hora inválida (HH:MM)' })
  time: string;

  @IsEnum(['pix', 'espécie'])
  payment_method: 'pix' | 'espécie';
}
