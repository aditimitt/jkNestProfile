import { Controller, Get, Post, Patch, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../shared/guards/roles.decorator'; // Import Roles decorator to restrict access based on user role
import { RolesGuard } from '../shared/guards/roles.guard'; // Import RolesGuard to enforce role-based access control
import { JwtAuthGuard } from '../auth/jwt.guard'; // Import JwtAuthGuard to secure routes with JWT authentication

// Controller for user-related operations
@Controller('users')
// Use JwtAuthGuard for securing the route and RolesGuard for enforcing role-based access control
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Endpoint to fetch all users, restricted to 'admin' role
    @Get()
    @Roles('admin') // Only users with 'admin' role can access this endpoint
    findAll() {
        return this.usersService.findAll(); // Delegate to the service to get all users
    }

    // Endpoint to update a user's role, restricted to 'admin' role
    @Patch('role')
    @Roles('admin') // Only users with 'admin' role can access this endpoint
    updateRole(@Body() updateRoleDto: UpdateRoleDto) {
        // Call the service method to update the user's role
        return this.usersService.updateRole(updateRoleDto.userId, updateRoleDto.role);
    }

    // Endpoint to delete a user by ID, restricted to 'admin' role
    @Delete(':id')
    @Roles('admin') // Only users with 'admin' role can access this endpoint
    async deleteUser(@Param('id') id: string) {
        // Call the service method to delete the user by ID
        await this.usersService.delete(id);
        // Return a success message upon deletion
        return { message: `User with ID ${id} has been deleted.` };
    }
}
