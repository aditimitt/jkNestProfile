import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Define the User entity, which will be mapped to the 'users' table in the database
@Entity('users')
export class User {

    // Primary key field: id is automatically generated as a UUID
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Email field: Ensures that each email in the 'users' table is unique
    @Column({ unique: true })
    email: string;

    // Password field: Stores the user's password (hashed or plain text depending on your application)
    @Column()
    password: string;

    // Role field: Defines the user's role, with a default value of 'viewer'
    // Valid roles: 'admin', 'editor', 'viewer'
    @Column({ default: 'viewer' })
    role: string;

    // Timestamp for when the user record is created
    @CreateDateColumn()
    createdAt: Date;

    // Timestamp for when the user record is last updated
    @UpdateDateColumn()
    updatedAt: Date;
}
