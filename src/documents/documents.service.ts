import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable() // Marks this class as injectable for dependency injection
export class DocumentsService {
    constructor(
        @InjectRepository(Document) // Injects the repository for the Document entity
        private readonly documentRepository: Repository<Document>, // Initializes the repository for interacting with the Document table
    ) { }

    // Creates a new document in the database
    async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
        const document = this.documentRepository.create(createDocumentDto); // Creates a new document entity
        return this.documentRepository.save(document); // Saves the document to the database
    }

    // Retrieves all documents from the database
    async findAll(): Promise<Document[]> {
        return this.documentRepository.find(); // Fetches all documents
    }

    // Updates an existing document based on its ID
    async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
        await this.documentRepository.update(id, updateDocumentDto); // Updates the document
        return this.documentRepository.findOne({ where: { id } }); // Returns the updated document
    }

    // Deletes a document by its ID
    async delete(id: string): Promise<{ statusCode: number; message: string }> {
        await this.documentRepository.delete(id); // Deletes the document
        return { statusCode: 200, message: `Document with ID ${id} has been deleted.` }; // Returns a success message
    }
}
