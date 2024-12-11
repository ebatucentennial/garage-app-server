# Garage Sale Deals - Server Side

## Overview
This repository contains the **server-side** code for the Garage Sale Deals application. The server provides APIs for user authentication, garage sale management, item management, and integration with third-party services like Google Maps.

## Features
- **User Authentication:** Secure JWT-based authentication.
- **Garage Sale Management:** Create, update, and delete garage sales.
- **Item Management:** Add, update, and delete items for garage sales.
- **Google Maps Integration:** Location-based features for garage sales.
- **Search Functionality:** Search for items and garage sales via API.

## Technologies Used
- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **Cloud Storage:** Cloudinary for image uploads
- **Google Maps API:** Location-based features

## Prerequisites
Before running the server-side application, ensure the following:

1. Node.js and npm installed.
2. A `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/garage-sale?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/garage-sale-server.git
   cd garage-sale-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in and receive a JWT.

### Garage Sales
- `GET /api/garage-sales/active-garage-sales`: Fetch active garage sales.
- `POST /api/garage-sales`: Create a new garage sale.
- `PUT /api/garage-sales/:id`: Update an existing garage sale.
- `DELETE /api/garage-sales/:id`: Delete a garage sale.

### Items
- `GET /api/items/:garageSaleId`: Fetch items for a garage sale.
- `POST /api/items`: Add a new item.
- `PUT /api/items/:id`: Update an item.
- `DELETE /api/items/:id`: Delete an item.

## Deployment

To deploy the server-side application:

1. Set up a MongoDB Atlas cluster and configure environment variables.
2. Deploy the application to a hosting service like Render or Heroku.

## Folder Structure

- **/controllers:** Business logic for various features.
- **/models:** Mongoose schemas for MongoDB collections.
- **/routes:** API routes for authentication, garage sales, and items.
- **/middleware:** Middleware functions like authentication.
- **/config:** Configuration files for MongoDB and Cloudinary.

## Contributing
Contributions are welcome! Please submit a pull request for any feature enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
