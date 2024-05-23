import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {}
  @Post()
  async createVote(@Body() value: number, @GetUser() user: User, id: string) {
    return this.voteService.createVote(id, value, user);
  }
}
