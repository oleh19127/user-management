import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '../auth/user.entity';
import { VoteService } from './vote.service';
import { Vote } from './vote.entity';

@Resolver(() => Vote)
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Mutation(() => Vote)
  async createVote(
    @Args('id') id: string,
    @Args('value') value: number,
    user: User,
  ) {
    await this.voteService.createVote(id, value, user);
    return true;
  }
}
