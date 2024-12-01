import { Test, TestingModule } from '@nestjs/testing'; // Importing NestJS testing utilities
import { DocumentsController } from './documents.controller'; // Importing the controller to be tested
import { DocumentsService } from './documents.service'; // Importing the service used by the controller
import { CreateDocumentDto } from './dto/create-document.dto'; // Importing DTO for creating a document
import { UpdateDocumentDto } from './dto/update-document.dto'; // Importing DTO for updating a document
import { TypeOrmModule } from '@nestjs/typeorm'; // Importing TypeORM module for database integration
import { Document } from './entities/document.entity'; // Importing the entity to be used in the tests
import { ConfigModule } from '@nestjs/config'; // Importing config module to load environment variables

describe('DocumentsController', () => {
  let controller: DocumentsController; // Declaring the controller instance
  let service: DocumentsService; // Declaring the service instance
  let createdDocumentId: string; // Variable to store the ID of the created document for cleanup after tests

  // beforeAll hook to set up the testing environment before all test cases are run
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Load .env configuration globally for testing
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST, // Database host from environment variables
          port: +process.env.DB_PORT, // Database port
          username: process.env.DB_USERNAME, // Database username
          password: process.env.DB_PASSWORD, // Database password
          database: process.env.DB_NAME, // Database name
          entities: [Document], // Registering the Document entity
          synchronize: true, // Synchronize the database schema (for testing only)
        }),
        TypeOrmModule.forFeature([Document]), // Importing the feature (document entity) into the test module
      ],
      controllers: [DocumentsController], // Registering the controller
      providers: [DocumentsService], // Registering the service
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController); // Get the controller instance
    service = module.get<DocumentsService>(DocumentsService); // Get the service instance
  });

  // afterAll hook to clean up after all test cases
  afterAll(async () => {
    // If a document was created, delete it after tests
    if (createdDocumentId) {
      await service.delete(createdDocumentId); // Cleanup the created document from the database
    }
  });

  it('should create a document', async () => {
    const createDocumentDto: CreateDocumentDto = {
      title: 'Test Document', // Title of the new document
      content: 'This is a test document.', // Content of the new document
    };

    // Call the controller method to create the document
    const result = await controller.create(createDocumentDto);
    createdDocumentId = result.id; // Save the ID of the created document for future cleanup

    // Assertions to verify the document was created correctly
    expect(result).toBeDefined(); // Ensure that the result is defined (document is created)
    expect(result.title).toBe(createDocumentDto.title); // Verify that the title is correct
    expect(result.content).toBe(createDocumentDto.content); // Verify that the content is correct
  });

  it('should return all documents', async () => {
    const createDocumentDto: CreateDocumentDto = {
      title: 'Another Document',
      content: 'Content of another document.',
    };
    await controller.create(createDocumentDto); // Ensure that a document is created for the test

    // Call the controller method to fetch all documents
    const documents = await controller.findAll();

    // Assertions to verify that the documents are fetched correctly
    expect(documents).toBeDefined(); // Ensure that documents are returned
    expect(documents.length).toBeGreaterThan(0); // Ensure that at least one document exists
  });

  it('should update a document', async () => {
    const updateDocumentDto: UpdateDocumentDto = {
      title: 'Updated Test Document', // New title for the document
      content: 'This content has been updated.', // New content for the document
    };

    // Call the controller method to update the document
    const updatedDocument = await controller.update(createdDocumentId, updateDocumentDto);

    // Assertions to verify that the document was updated correctly
    expect(updatedDocument).toBeDefined(); // Ensure that the updated document is returned
    expect(updatedDocument.title).toBe(updateDocumentDto.title); // Verify that the title was updated
    expect(updatedDocument.content).toBe(updateDocumentDto.content); // Verify that the content was updated
  });

  it('should delete a document', async () => {
    // Call the controller method to delete the document
    const result = await controller.delete(createdDocumentId);

    // Assertions to verify that the deletion was successful
    expect(result).toBeDefined(); // Ensure that the result is defined
    expect(result.statusCode).toBe(200); // Ensure that the status code is 200 (successful deletion)
    expect(result.message).toBe(`Document with ID ${createdDocumentId} has been deleted.`); // Verify that the message is correct

  });
});
