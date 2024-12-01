import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service'; // Import the IngestionService
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs'; // Import RxJS 'of' to mock HTTP responses
import { AxiosResponse } from 'axios'; // Import AxiosResponse type for mocking

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let httpService: HttpService;

  // Mocked response for the HTTP request
  const mockHttpResponse: AxiosResponse = {
    data: 'Ingestion Triggered',
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: undefined
    },
  };

  beforeEach(async () => {
    // Mocking HttpService
    const mockHttpService = {
      post: jest.fn().mockReturnValue(of(mockHttpResponse)), // Mocking post method to return the mocked response
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService); // Get the IngestionService instance
    httpService = module.get<HttpService>(HttpService); // Get the HttpService instance
  });

  // Test case to check if the ingestion API is called correctly
  describe('triggerIngestion', () => {
    it('should trigger ingestion and return response data', async () => {
      const payload = { key: 'value' }; // Sample payload

      const result = await ingestionService.triggerIngestion(payload);

      // Verify that the post method was called with the correct URL and payload
      expect(httpService.post).toHaveBeenCalledWith(
        process.env.PYTHON_BACKEND_URL || 'http://localhost:5000/ingest',
        payload,
      );

      // Verify that the result returned from triggerIngestion is correct
      expect(result).toBe('Ingestion Triggered');
    });

    it('should update ingestionStatus with in-progress status', async () => {
      const payload = { key: 'value' };

      await ingestionService.triggerIngestion(payload);

      // Verify that ingestionStatus was updated
      expect(ingestionService.getIngestionStatus()).toEqual([
        {
          id: expect.any(Number),
          status: 'In Progress',
          payload,
        },
      ]);
    });
  });

  // Test case for getIngestionStatus
  describe('getIngestionStatus', () => {
    it('should return the list of ingestion statuses', () => {
      const status = ingestionService.getIngestionStatus();

      // Ensure the list is empty initially or contains correct statuses
      expect(status).toEqual([]);
    });
  });
});
