# Express Skeleton Code

This repository provides a structured skeleton for building a Node.js server using Express with TypeScript. It incorporates best practices for organizing code, managing routes, and utilizing dependency injection.

## Project Structure

The project is organized into the following folders:

- **app**
  - **controllers**: Contains the controller classes that handle incoming requests and implement the business logic. Each controller typically corresponds to a specific resource (e.g., users, products).
  - **middlewares**: Contains middleware functions that can be used in the request processing pipeline. Middleware can perform actions such as logging, authentication, and request validation.
  - **models**: This folder includes the Sequelize models representing the database tables. Each model defines the structure of a specific entity.
  - **routes**: Contains route definition files. Each route file defines the endpoints for a particular resource and integrates the corresponding controller.
  - **services**: Houses service classes that encapsulate the business logic. These services are used by the controllers to interact with the database models or perform operations.
  - **interfaces**: Contains TypeScript interfaces that define contracts for various components, such as routes or services.
  - **exceptions**: Defines custom exceptions and error handling mechanisms.
  - **config**: Configuration files for the application, such as database configuration.
  - **daos**: Contains the required dao files for the system to work.
  - **dtos**: Contains the required dto files for input and output in the system
  - **migrations**: Contains the migration for the DB schema.
  
## Key Files

- **index.ts**: The main entry point of the application. It initializes the Express application, sets up middleware, and registers routes.
  
- **app.ts**: Defines the Express application and centralizes middleware setup.

- **server.ts**: Contains the server setup and starts listening on a specified port.

- **db-config.ts**: Contains the database connection configuration and setup logic.

- **.eslintrc.js**: ESLint configuration file for code linting and enforcing coding standards.

- **.prettierrc**: Prettier configuration file for code formatting.

## Integrating New Routes

To add a new route to the application, follow these steps:

1. **Create a New Controller**:
   - Create a new file in the `controllers` folder (e.g., `newController.ts`).
   - Define the controller class and implement the necessary methods for handling requests.

2. **Create a New Service**:
   - If needed, create a new file in the `services` folder (e.g., `newService.ts`).
   - Implement the business logic required for the controller.

3. **Define Routes**:
   - Create a new file in the `routes` folder (e.g., `newRoutes.ts`).
   - Import the new controller and set up the routes using Express Router.

4. **Register the New Routes**:
   - Update the `index.ts` file to import the new route file and use it in the application. Ensure to define the path for the new routes appropriately.

5. **Test the New Routes**:
   - Once the new routes are integrated, test them using tools like Postman or curl to ensure they work as expected.

## Running the Application

To run the application, follow these commands:

```bash
# Install dependencies
npm install

# Start the application
npm run start
