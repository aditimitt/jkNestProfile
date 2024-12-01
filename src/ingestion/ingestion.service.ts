import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

// Service responsible for handling the ingestion logic
@Injectable()
export class IngestionService {
    // Array to hold the ingestion status information
    private ingestionStatus = [];

    // Injecting HttpService to make HTTP requests to external services (e.g., Python backend)
    constructor(private readonly httpService: HttpService) { }

    // Method to trigger the ingestion process
    async triggerIngestion(payload: any): Promise<string> {
        // Making a POST request to the Python backend (mocked for this example)
        const response = await this.httpService
            .post(process.env.PYTHON_BACKEND_URL || 'http://localhost:5000/ingest', payload)
            .toPromise(); // Waiting for the response from the external service

        // Adding an entry to the ingestion status array to track the process
        this.ingestionStatus.push({ id: Date.now(), status: 'In Progress', payload });

        // Returning the response data from the backend
        return response.data;
    }

    // Method to get the current status of ingestion processes
    getIngestionStatus() {
        // Returning the current ingestion status
        return this.ingestionStatus;
    }
}
