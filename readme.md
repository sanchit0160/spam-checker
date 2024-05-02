# Spam Checker API

The Spam Checker API provides functionality to check if a phone number is spam or to find a person's name by searching for their phone number. It includes features like user authentication, spam detection, and user data population...

## Prerequisites

Before running the application, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. Install the project dependencies [no need to install anything globally]:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following configurations to the `.env` file:

   ```env
   PORT=5000
   jwtSecret=yourSecretKey
   ```

   Replace `yourSecretKey` with a secret key for JWT authentication.

### Start the Application

To start the application, run the following command:

```bash
npm start
```

The server will start running at the specified port (default is 5000).

### Development Mode

To run the application in development mode with nodemon (auto-restart on file changes), use:

```bash
npm run dev
```

## Endpoints

Test your endpoints using postman collections inside postman-collections folder

- `/v1/user`: User-related endpoints
- `/v1/spam`: Spam detection endpoints
- `/v1/search`: Search endpoints

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

- Sanchit Kumar