import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Data Transfer Object (DTO) for Registration functionality
export class RegisterDto {
    // Validate that the 'email' field contains a valid email format
    @IsEmail()
    email: string;

    // Validate that the 'password' field is not empty and has a minimum length of 6 characters
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
