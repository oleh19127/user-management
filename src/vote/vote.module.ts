import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Vote } from './vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';
import { VoteRepository } from './vote.repository';
import { VoteResolver } from './vote.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), ProfileModule, AuthModule],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository, VoteResolver],
})
export class VoteModule {}
