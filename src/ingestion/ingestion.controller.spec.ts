import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { of } from 'rxjs'; // For mocking the HttpService response

describe('IngestionController', () => {
  let ingestionController: IngestionController;
  let ingestionService: IngestionService;

  beforeEach(async () => {
    // Mocking the IngestionService
    const mockIngestionService = {
      triggerIngestion: jest.fn().mockResolvedValue('Ingestion Triggered'),
      getIngestionStatus: jest.fn().mockReturnValue([]), // Mock an empty status initially
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  // Test case for triggerIngestion endpoint
  describe('triggerIngestion', () => {
    it('should trigger ingestion and return the response', async () => {
      const payload = { key: 'value' }; // Sample payload

      const result = await ingestionController.triggerIngestion(payload);

      // Verify that the triggerIngestion method was called with the correct payload
      expect(ingestionService.triggerIngestion).toHaveBeenCalledWith(payload);

      // Verify the returned result
      expect(result).toBe('Ingestion Triggered');
    });
  });

  // Test case for getIngestionStatus endpoint
  describe('getIngestionStatus', () => {
    it('should return the list of ingestion statuses', () => {
      const result = ingestionController.getIngestionStatus();

      // Verify that the getIngestionStatus method was called
      expect(ingestionService.getIngestionStatus).toHaveBeenCalled();

      // Verify the returned result (should be an empty array as mocked)
      expect(result).toEqual([]);
    });
  });
});
