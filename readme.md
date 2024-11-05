
# Discount-coupon-Apis-implementation

The Discount Coupon API is designed to manage and apply various types of discount coupons for an e-commerce platform. It supports the seamless integration of multiple coupon types, including cart-wise, product-specific, and "Buy X, Get Y" (BxGy) offers, with a focus on scalable design to accommodate additional discount logic in the future.

This API aims to provide robust, flexible discount management, enabling the creation, retrieval, and application of diverse coupon types.




## Implemented Features

**Core Coupon Types**

*Cart-wise Coupons*: Discounts applied based on the total cart value when a minimum threshold is met.

Example: 10% off on cart totals exceeding ₹1000.

*Product-wise Coupons*: Discounts applied to specific products in the cart, useful for product-specific promotions.

Example: 15% off on Product X.

*BxGy Coupons*: "Buy X, Get Y" deals, supporting limits on the number of free or discounted items.

Example: Buy 2 items from Category A, get 1 item from Category B free.
## API Endpoints

The following endpoints are implemented to support coupon management and application:

POST ***/coupons***: Create a new coupon with details such as type, discount value, applicable products, and restrictions.


GET ***/coupons***: Retrieve all available coupons.


GET ***/coupons/{id}***: Retrieve a specific coupon by its ID.


PUT ***/coupons/{id}***: Update coupon details for a given ID.


DELETE ***/coupons/{id}***: Delete a coupon by ID.


POST ***/applicable-coupons***: Retrieve and calculate all applicable coupons for a given cart.

POST ***/apply-coupon/{id}***: Apply a specific coupon to a cart and return the updated cart with discounted prices.
## Discount Calculation logic

Discount Verification: Each coupon type checks conditions before applying, such as minimum cart value, applicable product IDs, and maximum usage limits.
BxGy Calculations: The BxGy coupon logic is limited to simple combinations and may require enhancements for complex applications.
## Future Enhancements

The following features were considered during the design phase but are not yet implemented. They provide a roadmap for future enhancements to the API:

**Area-Specific Coupons**:

Description: Coupons applicable only to certain area IDs.

Use Case: Creating location-based discounts, e.g., offering a discount specifically for customers in certain cities.
Implementation Note: Area IDs can be validated against the user's delivery location or IP-geolocation data.

**User-Specific Coupons**:

Description: Coupons restricted to specific users or user groups, such as VIP or first-time customers.

Use Case: Personalizing discounts for different customer segments to increase retention.

Implementation Note: User ID validation ensures the coupon applies only to eligible users.

**Category-Based Coupons**:

Description: Discounts applicable to entire product categories, such as electronics or fashion.

Use Case: Category-specific sales, e.g., "10% off on all fashion items."

Implementation Note: Products in the cart would require category metadata to validate the coupon’s applicability.

**Multiple Coupon Stacking**:

Description: Allowing multiple coupons to be applied to a single cart.

Use Case: Stacking discounts where eligible, enabling a richer discount experience for customers.

Implementation Note: Rules would need to be defined to prioritize and combine discounts, with safeguards to prevent excessive stacking.

**Best Discount Calculation**:

Description: Automatically calculating and displaying the best possible discount when multiple applicable coupons exist.

Use Case: Ensuring customers always get the maximum possible discount.

Implementation Note: The system can sort and select the highest discount or the most beneficial coupon type based on the cart contents.
## An Important Fact.

According to the implementation, I there are 1 lakh active coupons in the system and around 100 items in the cart the response time will be around 500 ms.


## Express Skeleton Code

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
