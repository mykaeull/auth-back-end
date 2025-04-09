import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SchedulingModule } from './scheduling/scheduling.module';
import { Scheduling } from './entities/scheduling.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Scheduling],
      synchronize: false, // cuidado! Nunca use true em produção com DB real
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    SchedulingModule,
  ],
})
export class AppModule {}
