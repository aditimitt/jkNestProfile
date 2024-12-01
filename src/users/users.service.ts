import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // Constructor to inject the UserRepository for interacting with the User entity
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Method to create a new user with a hashed password
  async create(email: string, password: string): Promise<User> {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entity with the email and hashed password
    const user = this.userRepository.create({ email, password: hashedPassword });

    // Save the user to the database and return the created user
    return this.userRepository.save(user);
  }

  // Method to find a user by their email
  async findByEmail(email: string): Promise<User> {
    // Query the database for a user with the provided email
    return this.userRepository.findOne({ where: { email } });
  }

  // Method to update the role of an existing user
  async updateRole(userId: string, role: string): Promise<User> {
    // Find the user by their ID
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // If no user is found, throw an error
    if (!user) throw new Error('User not found');

    // Update the user's role
    user.role = role;

    // Save the updated user and return it
    return this.userRepository.save(user);
  }

  // Method to retrieve all users
  async findAll(): Promise<User[]> {
    // Return all users from the database
    return this.userRepository.find();
  }

  // Method to delete a user by their ID
  async delete(userId: string): Promise<void> {
    // Find the user by their ID
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // If no user is found, throw an error
    if (!user) throw new Error('User not found');
    
    // Delete the user from the database
    await this.userRepository.delete(userId);
  }
}
