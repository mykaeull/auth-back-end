import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
