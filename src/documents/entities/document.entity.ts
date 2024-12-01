import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'; // Import decorators from TypeORM

// Document entity represents the 'documents' table in the database
@Entity('documents') // This decorator marks the class as a TypeORM entity and maps it to the 'documents' table in the database
export class Document {
    // The 'id' column is the primary key, auto-generated as a UUID
    @PrimaryGeneratedColumn('uuid')
    id: string; // The unique identifier for each document

    // The 'title' column stores the title of the document
    @Column()
    title: string; // Represents the title of the document

    // The 'content' column stores the content of the document
    @Column()
    content: string; // Represents the content of the document

    // The 'createdAt' column stores the timestamp when the document was created
    @CreateDateColumn()
    createdAt: Date; // Automatically stores the creation date when the document is saved
}
