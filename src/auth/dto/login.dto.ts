import { IsEmail, IsString } from 'class-validator';

// Data Transfer Object (DTO) for Login functionality
export class LoginDto {
    // Validate that the 'email' field contains a valid email format
    @IsEmail()
    email: string;

    // Validate that the 'password' field is a non-empty string
    @IsString()
    password: string;
}
