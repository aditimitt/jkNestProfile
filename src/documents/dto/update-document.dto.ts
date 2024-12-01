import { IsString, IsOptional } from 'class-validator'; // Import the IsString and IsOptional validators from class-validator

// UpdateDocumentDto is a Data Transfer Object (DTO) that defines the structure of the data required to update a document
export class UpdateDocumentDto {
    // The title property is optional and must be a string if provided, validated using the @IsString() and @IsOptional() decorators
    @IsString()
    @IsOptional() // Marks this property as optional during updates
    title?: string;

    // The content property is optional and must be a string if provided, validated using the @IsString() and @IsOptional() decorators
    @IsString()
    @IsOptional() // Marks this property as optional during updates
    content?: string;
}
