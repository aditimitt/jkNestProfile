# **Project Name**
A scalable NestJS-based application featuring user management, authentication, ingestion API integration with a Python backend, and robust testing capabilities.

## **Table of Contents**
1. [Overview](#overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [Getting Started](#getting-started)  
5. [Environment Variables](#environment-variables)  
6. [Project Structure](#project-structure)  
7. [Database Schema and Seed Data](#database-schema-and-seed-data)  
8. [API Endpoints](#api-endpoints)  
9. [Testing](#testing)  
10. [Future Enhancements](#future-enhancements)

## **Overview**
This project demonstrates a backend application built with NestJS, focused on:
- User authentication using JWT.
- Role-based access control (RBAC).
- Integration with an external Python backend for ingestion operations.
- Clean code principles, automated testing, and scalability considerations.

## **Features**
1. **Authentication**:  
   - User registration and login using JWT.
   - Role-based access control for restricted routes.

2. **Ingestion API**:  
   - Trigger ingestion operations via a Python backend.
   - Retrieve ingestion status.

3. **Testing**:  
   - Unit and integration tests for services and controllers.

4. **Scalability**:  
   - Designed for handling large datasets and user traffic. 

## **Technologies Used**
- **Framework**: [NestJS](https://nestjs.com/)  
- **Database**: PostgreSQL (via TypeORM)  
- **Authentication**: JWT  
- **External Communication**: Python backend integration using Axios  
- **Testing**: Jest with mocks for services and API endpoints  
- **Languages**: TypeScript  

## **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/)  
- [Python](https://www.python.org/) backend for ingestion (optional but recommended).

### **Installation**
1. Clone the repository:  
   ```bash
   git clone https://github.com/aditimitt/jkNestProfile.git
   cd jkNestProfile
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables.

4. Start the application:
    ```bash
    npm run start:dev
    ```

5. Run seed command:
    ```bash
    npm run seed
    ```

### **Testing**
1. Execute all tests:

   ```bash
    npm test
    ```

2. Check test coverage:
   ```bash
    npm run test:cov
    ```

## **Contributing**
Feel free to submit issues and pull requests to improve this project. Ensure changes are covered with appropriate tests.
