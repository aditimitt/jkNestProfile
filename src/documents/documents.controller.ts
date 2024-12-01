import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common'; // Import necessary decorators and modules from NestJS
import { DocumentsService } from './documents.service'; // Import the DocumentsService for business logic
import { CreateDocumentDto } from './dto/create-document.dto'; // Import DTO for creating a document
import { UpdateDocumentDto } from './dto/update-document.dto'; // Import DTO for updating a document

@Controller('documents') // Define the base route for the controller
export class DocumentsController {
    // Injecting the DocumentsService into the controller
    constructor(private readonly documentsService: DocumentsService) { }

    // POST /documents - Create a new document
    @Post()
    create(@Body() createDocumentDto: CreateDocumentDto) {
        // Delegates to the DocumentsService to handle the logic for creating a document
        return this.documentsService.create(createDocumentDto);
    }

    // GET /documents - Get all documents
    @Get()
    findAll() {
        // Delegates to the DocumentsService to fetch all documents
        return this.documentsService.findAll();
    }

    // PATCH /documents/:id - Update a document by its ID
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        // Delegates to the DocumentsService to update the document with the provided ID
        return this.documentsService.update(id, updateDocumentDto);
    }

    // DELETE /documents/:id - Delete a document by its ID
    @Delete(':id')
    delete(@Param('id') id: string) {
        // Delegates to the DocumentsService to delete the document with the provided ID
        return this.documentsService.delete(id);
    }
}
