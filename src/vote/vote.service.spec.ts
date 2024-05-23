import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { User } from '../auth/user.entity';
import { UserRole } from 'src/auth/enums/user-role.enum';

const mockVoteRepository = () => ({
  createVote: jest.fn(),
});

describe('VoteService', () => {
  let voteService: VoteService;
  let voteRepository: VoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        { provide: VoteRepository, useFactory: mockVoteRepository },
      ],
    }).compile();

    voteService = module.get<VoteService>(VoteService);
    voteRepository = module.get<VoteRepository>(VoteRepository);
  });

  it('should create a vote', async () => {
    const id = '39b4f93b-74b7-402d-b1b6-86166362fc32';
    const value = 1;
    const mockUser: User = {
      id: '6fa23aad-ef6b-4483-b6b2-a87fde7b3cac',
      avatar: 'avatar',
      gmail: 'gmail',
      password: 'pass',
      role: UserRole.USER,
      profiles: [],
    };

    await voteService.createVote(id, value, mockUser);

    expect(voteRepository.createVote).toHaveBeenCalledWith(id, value, mockUser);
  });
});
