// src/ingestion/ingestion.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // Import HttpModule
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [HttpModule],  // Add HttpModule here
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
