import { Controller, Post, Body, Get } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

// Controller to handle requests related to ingestion
@Controller('ingestion')
export class IngestionController {
  // Injecting IngestionService to interact with the ingestion logic
  constructor(private readonly ingestionService: IngestionService) {}

  // Endpoint to trigger the ingestion process, accepts payload in the request body
  @Post('trigger')
  triggerIngestion(@Body('payload') payload: any) {
    // Calls the service to trigger ingestion with the provided payload
    return this.ingestionService.triggerIngestion(payload);
  }

  // Endpoint to get the status of the ingestion process
  @Get('status')
  getIngestionStatus() {
    // Calls the service to fetch the status of the ingestion process
    return this.ingestionService.getIngestionStatus();
  }
}
