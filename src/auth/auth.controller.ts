import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common'; // Import necessary decorators and exceptions
import { AuthService } from './auth.service'; // Import AuthService to handle business logic for authentication
import { LoginDto } from './dto/login.dto'; // Import LoginDto to validate the structure of the login request
import { RegisterDto } from './dto/register.dto'; // Import RegisterDto to validate the structure of the registration request

@Controller('auth') // Define the controller route prefix as 'auth'
export class AuthController {
  // Inject AuthService into the controller to handle authentication logic
  constructor(private readonly authService: AuthService) {}

  // POST endpoint for logging in
  @Post('login') 
  async login(@Body() loginDto: LoginDto) {
    // Validate user credentials using the AuthService
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    // If the user is not found (invalid credentials), throw UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If user credentials are valid, return the login result (access token)
    return this.authService.login(user);
  }

  // POST endpoint for registering a new user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      // Try to register the user using the AuthService
      const user = await this.authService.register(registerDto.email, registerDto.password);
      
      // Return a success message with user details upon successful registration
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      // If the email is already taken (ConflictException), propagate the error
      if (error instanceof ConflictException) {
        throw error;
      }
      
      // For other errors, throw an UnauthorizedException
      throw new UnauthorizedException('Registration failed');
    }
  }
}
