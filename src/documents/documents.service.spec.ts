import { Test, TestingModule } from '@nestjs/testing'; // Import testing utilities from NestJS
import { DocumentsService } from './documents.service'; // Import the service to be tested
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM module for database integration
import { Document } from './entities/document.entity'; // Import the Document entity
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule to load environment variables
import { Repository } from 'typeorm'; // Import the Repository class from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import to get the repository token for injections
import { CreateDocumentDto } from './dto/create-document.dto'; // Import DTO for creating documents
import { UpdateDocumentDto } from './dto/update-document.dto'; // Import DTO for updating documents

describe('DocumentsService', () => {
  let service: DocumentsService; // Declare the service variable
  let repository: Repository<Document>; // Declare the repository variable
  let createdDocumentId: string; // Declare a variable to track the ID of the created document

  beforeAll(async () => {
    // Setup the testing module before running tests
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
        TypeOrmModule.forRoot({
          type: 'postgres', // Use PostgreSQL as the database type
          host: process.env.DB_HOST, // Use environment variable for the database host
          port: +process.env.DB_PORT, // Use environment variable for the database port
          username: process.env.DB_USERNAME, // Use environment variable for the database username
          password: process.env.DB_PASSWORD, // Use environment variable for the database password
          database: process.env.DB_NAME, // Use environment variable for the database name
          entities: [Document], // Specify the entity to be used with TypeORM
          synchronize: true, // Synchronize the database schema during testing (disable for production)
        }),
        TypeOrmModule.forFeature([Document]), // Register the Document entity for testing
      ],
      providers: [DocumentsService], // Provide the service to be tested
    }).compile();

    // Retrieve the service and repository instances from the module
    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterAll(async () => {
    // Cleanup after all tests have run
    if (createdDocumentId) {
      // If a document was created, delete it
      await service.delete(createdDocumentId);
    }

    // Close the database connection
    await repository.manager.connection.close();
  });

  it('should create a document', async () => {
    const createDocumentDto: CreateDocumentDto = {
      title: 'Test Document', // Title of the new document
      content: 'This is a test document.', // Content of the new document
    };

    // Call the service method to create a document
    const result = await service.create(createDocumentDto);

    // Save the created document's ID for cleanup in afterAll
    createdDocumentId = result.id;

    // Assertions to verify the document was created correctly
    expect(result).toBeDefined(); // The result should be defined
    expect(result.title).toBe(createDocumentDto.title); // The title should match the input
    expect(result.content).toBe(createDocumentDto.content); // The content should match the input
  });

  it('should return all documents', async () => {
    const createDocumentDto: CreateDocumentDto = {
      title: 'Another Document', // Title of another document
      content: 'This is content for another document.', // Content for another document
    };

    await service.create(createDocumentDto); // Create a new document

    const documents = await service.findAll(); // Call the service to get all documents

    // Assertions to verify documents are returned correctly
    expect(documents).toBeDefined(); // The result should be defined
    expect(documents.length).toBeGreaterThan(0); // The number of documents should be greater than 0
  });

  it('should update a document', async () => {
    const updateDocumentDto: UpdateDocumentDto = {
      title: 'Updated Document', // New title for the document
      content: 'The content has been updated.', // New content for the document
    };

    // Call the service to update the document using the previously created document ID
    const updatedDocument = await service.update(createdDocumentId, updateDocumentDto);

    // Assertions to verify the document was updated correctly
    expect(updatedDocument).toBeDefined(); // The updated document should be defined
    expect(updatedDocument.title).toBe(updateDocumentDto.title); // The title should be updated
    expect(updatedDocument.content).toBe(updateDocumentDto.content); // The content should be updated
  });

  it('should delete a document', async () => {
    // Call the service to delete the document using the previously created document ID
    const result = await service.delete(createdDocumentId);

    // Assertions to verify the document was deleted successfully
    expect(result).toBeDefined(); // The result should be defined
    expect(result.statusCode).toBe(200); // The status code should be 200 for successful deletion
    expect(result.message).toBe(`Document with ID ${createdDocumentId} has been deleted.`); // The message should confirm deletion

    // Try to fetch the deleted document to verify it was removed
    const deletedDocument = await repository.findOne({ where: { id: createdDocumentId } });
    expect(deletedDocument).toBeNull(); // The document should be null after deletion
  });
});
