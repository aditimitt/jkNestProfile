import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { UpdateRoleDto } from './dto/update-role.dto';
import { v4 as uuidv4 } from 'uuid';

// Mock JwtService for testing: This class mocks the behavior of the actual JwtService
// so that tests are not dependent on real JWT generation.
class MockJwtService {
  sign() {
    return 'mocked-jwt-token'; // Return a mocked token
  }
}

// Mock JwtAuthGuard to bypass authentication during tests
// This allows us to bypass any actual authentication logic and directly test the controller methods.
class MockJwtAuthGuard {
  canActivate() {
    return true; // Always return true to allow the request to proceed
  }
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Setup the testing module before all tests
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Load configuration globally, including .env variables for database connection
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        // Configure TypeORM for the test database
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User], // Include the User entity
          synchronize: true, // Automatically sync the database (for testing only)
        }),
        // Include the User entity for feature testing
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController], // Inject the UsersController
      providers: [
        UsersService, // Inject the UsersService
        { provide: JwtService, useClass: MockJwtService }, // Mock JwtService
        { provide: Reflector, useClass: Reflector }, // Use Reflector for route metadata reflection
        { provide: APP_GUARD, useClass: MockJwtAuthGuard }, // Mock the JwtAuthGuard to bypass actual authentication
      ],
    }).compile();

    // Retrieve instances of the controller and service
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // Clean up the database after each test
  afterEach(async () => {
    // Clear all users from the database after each test to ensure no test data remains
    await service.findAll().then((users) => {
      users.forEach((user) => service.delete(user.id)); // Delete each user
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Create users in the database for testing
      await service.create('test1@example.com', 'password1');
      await service.create('test2@example.com', 'password2');

      // Call the controller's findAll method
      const users = await controller.findAll();

      // Assert that the users are returned and match the expected data
      expect(users).toBeDefined();
      expect(users[0].email).toBe('test1@example.com');
      expect(users[1].email).toBe('test2@example.com');
    });
  });

  describe('updateRole', () => {
    it('should update a user\'s role', async () => {
      // Create a user for testing
      const user = await service.create('test@example.com', 'password123');
      // Create a DTO to update the user's role
      const updateRoleDto: UpdateRoleDto = { userId: user.id, role: 'admin' };

      // Call the controller's updateRole method
      const updatedUser = await controller.updateRole(updateRoleDto);

      // Assert that the role was successfully updated
      expect(updatedUser).toBeDefined();
      expect(updatedUser.role).toBe('admin');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a success message', async () => {
      // Create a user for testing
      const user = await service.create('test@example.com', 'password123');

      // Call the controller's deleteUser method to delete the user
      const result = await controller.deleteUser(user.id);

      // Retrieve all users from the database to verify the deletion
      const allUsers = await service.findAll();

      // Assert that the user was deleted and that no users remain
      expect(result).toEqual({ message: `User with ID ${user.id} has been deleted.` });
      expect(allUsers.length).toBe(0); // No users should be left
    });

    it('should throw an error if the user does not exist', async () => {
      // Generate a random UUID for a non-existent user
      const invalidUserId = uuidv4();

      // Expect the controller's deleteUser method to throw an error
      // when trying to delete a non-existent user
      await expect(controller.deleteUser(invalidUserId)).rejects.toThrowError(
        'User not found',
      );
    });
  });
});
