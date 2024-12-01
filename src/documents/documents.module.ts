// src/documents/documents.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],  // Register the Document entity
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
