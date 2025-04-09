import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('scheduling')
export class Scheduling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: 'corte' | 'barba' | 'corte&barba';

  @Column({ type: 'date' })
  date: string;

  @Column()
  payment_method: 'pix' | 'espécie';

  @Column({ default: false })
  paid: boolean;

  @Column({ type: 'numeric' })
  amount: number;

  @Column()
  time: string;

  @Column()
  contact: string;
}
