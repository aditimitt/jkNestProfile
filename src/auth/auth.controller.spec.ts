import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Setup before all tests
  beforeAll(async () => {
    // Mock JwtService to simulate JWT token generation
    const mockJwtService = {
      sign: jest.fn(() => 'mockJwtToken'), // Return a mock token
    };

    // Mock UsersService for findOne method (this would be used to fetch user from DB)
    const mockUsersService = {
      findOne: jest.fn(), // Placeholder for findOne method
    };

    // Mock User object that might be returned by the service
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword', // Password would be hashed
      role: 'user', // Role of the user
      createdAt: new Date(), // Date of account creation
      updatedAt: new Date(), // Date of last update
    };

    // Mock AuthService methods used in controller
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn((user) => ({ access_token: 'mockJwtToken' })), // Return mock token
      register: jest.fn(),
    };

    // Create the testing module with the necessary providers and controllers
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController], // Controller to be tested
      providers: [
        {
          provide: AuthService, // Use mocked AuthService instead of the real one
          useValue: mockAuthService,
        },
        {
          provide: JwtService, // Use mocked JwtService instead of the real one
          useValue: mockJwtService,
        },
        {
          provide: UsersService, // Use mocked UsersService instead of the real one
          useValue: mockUsersService,
        },
      ],
    }).compile();

    // Get instances of AuthController and AuthService for testing
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Tests for register functionality
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = { email: 'test@example.com', password: 'password' };

      // Mocking the register method to resolve with a user object
      jest.spyOn(authService, 'register').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword', // Simulating a hashed password
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Call the register method on the controller and verify the result
      const result = await authController.register(registerDto);

      // Verify that register method was called with correct parameters
      expect(authService.register).toHaveBeenCalledWith(registerDto.email, registerDto.password);
      // Verify the returned result structure
      expect(result).toEqual({
        message: 'User registered successfully', // Success message
        user: {
          id: '1',
          email: 'test@example.com',
          password: 'hashedpassword',
          role: 'user',
          createdAt: expect.any(Date), // Expect any Date object
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw a conflict exception if email is already registered', async () => {
      const registerDto = { email: 'test@example.com', password: 'password' };

      // Simulating a conflict exception when trying to register an existing user
      jest.spyOn(authService, 'register').mockRejectedValue(new ConflictException());

      // Verify that ConflictException is thrown when trying to register an existing user
      await expect(authController.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  // Tests for login functionality
  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      // Mocking validateUser to return a full user object when credentials are correct
      jest.spyOn(authService, 'validateUser').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword', // Hashed password
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mocking the login method to return an object with access_token only
      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'mockJwtToken' });

      // Call the login method on the controller and verify the result
      const result = await authController.login(loginDto);

      // Verify validateUser was called with correct parameters
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      // Verify login was called with correct user details
      expect(authService.login).toHaveBeenCalledWith({
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      // Verify the returned result (JWT token)
      expect(result).toEqual({
        access_token: 'mockJwtToken', // Mock token returned from the login method
      });
    });

    it('should throw an unauthorized exception for invalid credentials', async () => {
      const loginDto = { email: 'invalid@example.com', password: 'wrongpassword' };

      // Mocking validateUser to return null for invalid credentials
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      // Verify that UnauthorizedException is thrown for invalid credentials
      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an unauthorized exception for non-existent user', async () => {
      const loginDto = { email: 'nonexistent@example.com', password: 'password' };

      // Mocking validateUser to return null for a non-existent user
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      // Verify that UnauthorizedException is thrown for non-existent user
      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
