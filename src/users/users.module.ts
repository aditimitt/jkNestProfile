import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JwtModule is imported to provide JWT-based authentication in the module.
    JwtModule.register({
      // Register the JWT module with the secret key and expiration time for the token.
      secret: process.env.JWT_SECRET || '411cbebbd087ef6bf61b64b4800a27a0eb1606807e9d5adcc5b05ddd3c57277c45068065a1fa286412e27bfa51925de2a8f043efdafcd839a57424d27404ebed',
      // Set the token's expiration time (1 hour in this case).
      signOptions: { expiresIn: '1h' },
    }),
    // TypeOrmModule is used to interact with the User entity in the database.
    TypeOrmModule.forFeature([User]), // Register the User entity for database operations
  ],
  providers: [
    UsersService, // Provide the UsersService to handle user-related business logic
  ],
  controllers: [
    UsersController, // Register the UsersController to handle incoming requests related to users
  ],
  exports: [
    UsersService, // Export the UsersService so it can be used in other modules
  ],
})
export class UsersModule { }
