import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs'); // Mock bcryptjs module

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('access_token'),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return null if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      // Mock findByEmail to return a valid user
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to resolve to `false` (password doesn't match)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      const email = 'test@example.com';
      const password = 'anyPassword';

      // Mock findByEmail to return null
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: '1', username: 'testuser', role: 'user' };

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'access_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
        role: user.role,
      });
    });
  });

  describe('register', () => {
    it('should throw a ConflictException if the email is already registered', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(email, password)).rejects.toThrow(ConflictException);
    });

    it('should create a new user if the email is not already registered', async () => {
      const email = 'newuser@example.com';
      const password = 'password';

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await authService.register(email, password);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(email, password);
    });
  });
});
