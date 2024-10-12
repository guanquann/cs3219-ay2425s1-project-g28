# Matching Service

## Setting-up Matching Service

1. In the `matching-service` directory, create a copy of the `.env.sample` file and name it `.env`.

2. To set up credentials for RabbitMq, update `RABBITMQ_DEFAULT_USER`, `RABBITMQ_DEFAULT_PASS` of the `.env` file. If you are running Matching Service individually, update `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS` to RabbitMq's default username `guest` and password `guest` respectively. If you are running Matching Service with the other services using the docker-compose file, you can update `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS` to whatever you want.

3. You can access RabbitMq management user interface locally with the username in `RABBITMQ_DEFAULT_USER` and password in `RABBITMQ_DEFAULT_PASS` at http://localhost:15672.

## Running Matching Service Individually with Docker

1. Set up and run RabbitMq locally on your computer with the command `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management`.

2. Follow the instructions [here](https://nodejs.org/en/download/package-manager) to set up Node v20.

3. Open Command Line/Terminal and navigate into the `matching-service` directory.

4. Run the command: `npm install`. This will install all the necessary dependencies.

5. Run the command `npm start` to start the Matching Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

## After running

1. To view Matching Service documentation, go to http://localhost:3002/docs.

2. Using applications like Postman, you can interact with the Matching Service on port 3002. If you wish to change this, please update the `.env` file.
