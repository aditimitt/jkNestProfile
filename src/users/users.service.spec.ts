import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  const createdUsers: string[] = []; // Array to keep track of created user IDs for cleanup

  // beforeAll runs once before all tests; it initializes the testing module
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // Load the .env file for database configuration (global configuration)
        }),
        TypeOrmModule.forRoot({
          type: 'postgres', // Use PostgreSQL as the database
          host: process.env.DB_HOST, // Database host from environment variables
          port: +process.env.DB_PORT, // Database port from environment variables
          username: process.env.DB_USERNAME, // Database username from environment variables
          password: process.env.DB_PASSWORD, // Database password from environment variables
          database: process.env.DB_NAME, // Database name from environment variables
          entities: [User], // Define entities to be used in the database
          synchronize: true, // Automatically sync the database schema (for testing only)
        }),
        TypeOrmModule.forFeature([User]), // Import the User entity for use in this module
      ],
      providers: [UsersService], // Provide the UsersService to the module
    }).compile();

    // Retrieve an instance of the UsersService from the testing module
    service = module.get<UsersService>(UsersService);
  });

  // afterAll runs once after all tests; it handles cleanup
  afterAll(async () => {
    // Clean up created users to ensure a clean state for each test run
    for (const userId of createdUsers) {
      try {
        await service.delete(userId); // Delete the user by ID
      } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error.message); // Log any errors
      }
    }

    // Close the database connection after all tests
    const connection = await service['userRepository'].manager.connection;
    await connection.close();
  });

  // Test case for creating a user with a hashed password
  it('should create a user with hashed password', async () => {
    const email = 'test@example.com';
    const password = 'password123';
  
    const newUser = await service.create(email, password); // Create a new user
    createdUsers.push(newUser.id); // Track the created user ID for cleanup
  
    expect(newUser).toBeDefined(); // Ensure the user is created
    expect(newUser.email).toBe(email); // Check the email matches
    expect(newUser.password).not.toBe(password); // Ensure the password is hashed, not stored as plain text
  });

  // Test case for finding a user by email
  it('should find a user by email', async () => {
    const email = 'find@example.com';
    const password = 'password123';
    const newUser = await service.create(email, password); // Create a new user
    createdUsers.push(newUser.id); // Track the created user ID for cleanup

    const user = await service.findByEmail(email); // Retrieve the user by email

    expect(user).toBeDefined(); // Ensure the user is found
    expect(user.email).toBe(email); // Check the email matches
  });

  // Test case for retrieving all users
  it('should return all users', async () => {
    const users = await service.findAll(); // Retrieve all users

    expect(users).toBeDefined(); // Ensure users are returned
    expect(users.length).toBeGreaterThan(0); // Ensure there is at least one user in the database
  });

  // Test case for updating the role of a user
  it('should update the role of a user', async () => {
    const email = 'update@example.com';
    const password = 'password123';
    const user = await service.create(email, password); // Create a new user
    createdUsers.push(user.id); // Track the created user ID for cleanup

    const updatedUser = await service.updateRole(user.id, 'admin'); // Update the user's role to 'admin'
  
    expect(updatedUser).toBeDefined(); // Ensure the user is updated
    expect(updatedUser.role).toBe('admin'); // Check the updated role
  });

  // Test case for handling an error if the user is not found during role update
  it('should throw an error if user not found during role update', async () => {
    const invalidUserId = uuidv4(); // Generate a random user ID (non-existent)
    await expect(service.updateRole(invalidUserId, 'admin')).rejects.toThrowError('User not found'); // Expect an error to be thrown
  });

  // Test case for deleting a user by ID
  it('should delete a user by ID', async () => {
    const email = 'delete@example.com';
    const password = 'password123';
    const user = await service.create(email, password); // Create a new user

    // Ensure the user is created and exists in the database
    const foundUser = await service.findByEmail(email);
    expect(foundUser).toBeDefined();

    // Delete the user by ID
    await service.delete(user.id);

    // Ensure the user is deleted by checking if it exists
    const deletedUser = await service.findByEmail(email);
    expect(deletedUser).toBeNull(); // The user should be null, indicating it was deleted
  });
});
