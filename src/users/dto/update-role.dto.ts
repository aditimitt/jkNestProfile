import { IsString, IsUUID, IsIn } from 'class-validator';

// DTO (Data Transfer Object) for updating a user's role
export class UpdateRoleDto {

    // Decorator to ensure that the userId is a valid UUID (Universally Unique Identifier)
    @IsUUID()
    userId: string;

    // Decorator to ensure that the role is a string and it must be one of the predefined values ('admin', 'editor', 'viewer')
    @IsString()
    @IsIn(['admin', 'editor', 'viewer'])
    role: string;
}
