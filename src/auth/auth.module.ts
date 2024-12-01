import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt.guard';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule


@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '411cbebbd087ef6bf61b64b4800a27a0eb1606807e9d5adcc5b05ddd3c57277c45068065a1fa286412e27bfa51925de2a8f043efdafcd839a57424d27404ebed',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy,JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
