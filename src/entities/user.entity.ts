import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Scheduling } from './scheduling.entity';

@Entity('user') // nome da tabela já existente no Railway
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Scheduling, (scheduling) => scheduling.user)
  schedulings: Scheduling[];
}
