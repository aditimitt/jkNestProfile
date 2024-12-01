// src/auth/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
    username: string;
    sub: string; // The subject (usually the user ID or unique identifier)
  }
  