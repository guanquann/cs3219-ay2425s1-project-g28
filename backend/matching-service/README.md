# Matching Service

## Setting-up Matching Service

1. In the `matching-service` directory, create a copy of the `.env.sample` file and name it `.env`.

## Running Matching Service without Docker

1. Follow the instructions [here](https://nodejs.org/en/download/package-manager) to set up Node v20.

2. Open Command Line/Terminal and navigate into the `matching-service` directory.

3. Run the command: `npm install`. This will install all the necessary dependencies.

4. Run the command `npm start` to start the Matching Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

## After running

1. To view Matching Service documentation, go to http://localhost:3002/docs.

2. Using applications like Postman, you can interact with the Matching Service on port 3002. If you wish to change this, please update the `.env` file.
