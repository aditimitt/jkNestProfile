import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'; // Import necessary exceptions and decorators
import { JwtService } from '@nestjs/jwt'; // Import JwtService to handle JWT token creation
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing and comparison
import { UsersService } from '../users/users.service'; // Import UsersService to interact with the user repository
import { User } from 'src/users/entities/user.entity'; // Import the User entity to represent the user model

@Injectable() // Marks the class as injectable, allowing it to be used as a service
export class AuthService {
  // Constructor to inject JwtService and UsersService into the AuthService
  constructor(
    private readonly jwtService: JwtService, // JwtService to generate JWT tokens
    private readonly usersService: UsersService, // UsersService to fetch or manage users
  ) {}

  // Method to validate user credentials (email and password)
  async validateUser(email: string, pass: string): Promise<any> {
    // Find user by email using the UsersService
    const user = await this.usersService.findByEmail(email);

    // If user exists and the password matches (bcrypt.compare compares hashed passwords)
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Remove the password field from the user object before returning it
      const { password, ...result } = user;
      return result; // Return the user object without password
    }

    // Return null if credentials are invalid or user does not exist
    return null;
  }

  // Method to handle login and return a JWT token
  async login(user: any) {
    // Payload for the JWT token, including user information like username, id, and role
    const payload = { username: user.username, sub: user.id, role: user.role };

    // Return the JWT token by signing the payload with the JwtService
    return {
      access_token: this.jwtService.sign(payload), // Sign the payload to create a token
    };
  }

  // Method to handle user registration
  async register(email: string, password: string): Promise<User> {
    // Check if the email is already registered by querying the UsersService
    const existingUser = await this.usersService.findByEmail(email);
    
    // If user already exists, throw a ConflictException to indicate email duplication
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // If email is not already registered, create a new user via the UsersService
    return this.usersService.create(email, password);
  }
}
