Certainly! Below is the README content formatted in Markdown:


# Elton's Management Application

This application is designed to facilitate the management of food items in a Kota shop, providing features such as adding, updating, and deleting items. It also includes user registration and login functionalities with authentication using JSON Web Tokens (JWTs). The front-end interface offers a concise dashboard displaying the current inventory levels of the food items.

## Features

- User registration and login with JWT authentication
- CRUD operations for managing food items
- Dashboard displaying inventory levels
- Dockerized deployment for ease of use

## Technologies Used

### Backend

- NestJS - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications
- MongoDB - A NoSQL database for storing application data
- JSON Web Tokens (JWT) - For user authentication and authorization

### Frontend

- Angular

### Deployment

- Docker - Containerization technology for packaging the application and its dependencies into a standardized unit

## Repository Structure

```
.
├── inventory-api/                # Backend NestJS application
├── inventory-web/               # Frontend application
├── docker-compose.yml      # Docker Compose file for container orchestration
└── README.md               # Project README file
```

## Getting Started

To run this application locally, follow these steps:

1. Clone this repository:

```bash
git clone <repository_url>
cd inventory
```
# Option 1: 

2. Navigate to the backend directory and install dependencies:

```bash
cd inventory-api
npm install
```

3. Set up environment variables by creating a `.env` file based on the `.env.example` provided.

4. Start the backend server:

```bash
npm start
```

5. Navigate to the frontend directory and install dependencies:

```bash
cd ../inventory-wev
npm install
```

6. Start the frontend server:

```bash
npm start
```

# Option 2:

2. Navigate to the root directory and start docker compose:

```bash
docker compose up
```

3. If you want to tear down the environment run:

```bash
docker compose down
```

7. Access the application at `http://localhost:3000` in your web browser.

## Screenshots

![Dashboard](screenshots/dashboard.png)
*Dashboard displaying inventory levels*

![Login](screenshots/login.png)
*Login page*

![Registration](screenshots/registration.png)
*Registration page*

## Contributors

- [Your Name](https://github.com/yourusername)

```

In this Markdown format, replace `[Framework of your choice]` with the JavaScript framework you choose to use for the frontend. Additionally, create a `screenshots` directory within your repository and place your design PNG images there. Update the links in the README accordingly.