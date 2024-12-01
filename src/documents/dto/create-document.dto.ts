import { IsString } from 'class-validator'; // Import the IsString validator from class-validator to ensure that the properties are strings

// CreateDocumentDto is a Data Transfer Object (DTO) that defines the structure of the data required to create a document
export class CreateDocumentDto {
    // The title property must be a string, validated using the @IsString() decorator
    @IsString()
    title: string;

    // The content property must be a string, validated using the @IsString() decorator
    @IsString()
    content: string;
}
