
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

   ## Running the Application

   Before running the application, you need to do some initial setup


   ```bash

   # create a .env file in the root directory and 
   # use these as environment variables in .env
   DB_USER=app_user
   DB_PASSWORD=app_password
   DB_NAME=mydb
   DB_HOST=localhost
   DB_DIALECT=mysql
   DB_PORT=3306
   SERVER_PORT=3000

   # To run the application, follow these commands:

   # If you want to use docker to create a container for mysql, use the following command
   docker-compose up -d

   # Install dependencies
   npm install

   # Run the migration
   npm run migrate

   # Start the application
   npm run dev
