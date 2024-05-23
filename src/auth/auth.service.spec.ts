import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import { UserRole } from './enums/user-role.enum';

const mockUserRepository = () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  getAllUsers: jest.fn(),
  getOneUser: jest.fn(),
  delete: jest.fn(),
  patchUser: jest.fn(),
  uploadAvatar: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
  });

  it('should sign up a new user', async () => {
    const userCredentials: SignUpDto = {
      gmail: 'testUser',
      password: 'password123',
      avatar: 'avatar',
      userRole: UserRole.USER,
    };
    userRepository.signUp.mockResolvedValue(undefined);

    await authService.signUp(userCredentials);

    expect(userRepository.signUp).toHaveBeenCalledWith(userCredentials);
  });

  it('should get all users', async () => {
    const mockUsers: User[] = [
      {
        id: '1436a28f-4479-4f77-bdf2-e22173e11305',
        gmail: 'user1',
        password: 'hash1',
        avatar: 'avatar1',
        role: UserRole.ADMIN,
        profiles: [],
      },
      {
        id: 'af171e0a-156f-4d35-9aad-48fdbc48d195',
        gmail: 'user2',
        password: 'hash2',
        avatar: 'avatar2',
        role: UserRole.MODERATOR,
        profiles: [],
      },
    ];
    userRepository.getAllUsers.mockResolvedValue(mockUsers);

    const users = await authService.getAllUsers(null);

    expect(users).toEqual(mockUsers);
    expect(userRepository.getAllUsers).toHaveBeenCalled();
  });

  it('should get a user by ID', async () => {
    const mockUser: User = {
      id: '1436a28f-4479-4f77-bdf2-e22173e11305',
      gmail: 'user1',
      password: 'hash1',
      avatar: 'avatar1',
      role: UserRole.ADMIN,
      profiles: [],
    };
    const userId = '1436a28f-4479-4f77-bdf2-e22173e11305';
    userRepository.getOneUser.mockResolvedValue(mockUser);

    const user = await authService.getOneUser(userId);

    expect(user).toEqual(mockUser);
    expect(userRepository.getOneUser).toHaveBeenCalledWith(userId);
  });

  it('should delete a user by ID', async () => {
    const userId = '1436a28f-4479-4f77-bdf2-e22173e11305';
    const mockDeleteResult: DeleteResult = { raw: 1, affected: 1 };
    userRepository.delete.mockResolvedValue(mockDeleteResult);

    await authService.deleteUser(userId);

    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should patch a user (update)', async () => {
    const userId = '1';
    const newUserPassword = 'some pass';
    userRepository.patchUser.mockResolvedValue(undefined);

    await authService.patchUser(userId, newUserPassword);

    expect(userRepository.patchUser).toHaveBeenCalledWith(
      userId,
      newUserPassword,
    );
  });
});
