import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteRepository)
    private voteRepository: VoteRepository,
  ) {}

  async createVote(id: string, value: number, user: User) {
    return this.voteRepository.createVote(id, value, user);
  }
}
