import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class VoteRepository extends Repository<Vote> {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    private userService: AuthService,
    private profileService: ProfileService,
  ) {
    super(
      voteRepository.target,
      voteRepository.manager,
      voteRepository.queryRunner,
    );
  }

  async createVote(id: string, value: number, user: User) {
    if (value != 1 && value != -1) {
      return 'Invalid value, possible only: 1, -1';
    }
    const found = await this.userService.getOneUser(user.id);
    if (found === null) {
      return 'User not found';
    }
    const profile = await this.profileService.getOneUserProfile(user, id);
    if (profile === null) {
      return 'Profile not found';
    }
    if (user.id === profile.user.id) {
      return 'Users cannot vote for themselves';
    }
    const lastVote = await this.findOne({
      where: {
        id,
        createdAt: MoreThan(new Date(Date.now() - 3600000)),
      },
    });
    if (lastVote) {
      return 'Users can vote one time per hour';
    }
    const vote = await this.findOneBy({
      id,
    });
    if (vote) {
      return 'User already voted for this profile';
    }
    const newVote = this.create({
      id,
      value,
    });
    await this.insert(newVote);
    return newVote;
  }
}
