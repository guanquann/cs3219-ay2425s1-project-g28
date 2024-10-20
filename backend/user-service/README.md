# User Service Guide

> Please ensure that you have completed the backend set-up [here](../README.md) before proceeding.

## Setting-up User Service

1. In the `user-service` directory, create a copy of the `.env.sample` file and name it `.env`.

2. To connect to your cloud MongoDB instead of your local MongoDB, set the `NODE_ENV` to `production` instead of `development`.

3. Update the following variables in the `.env` file:

   - `MONGO_CLOUD_URI`

   - `MONGO_LOCAL_URI`

   - `FIREBASE_PROJECT_ID`

   - `FIREBASE_PRIVATE_KEY`

   - `FIREBASE_CLIENT_EMAIL`

   - `FIREBASE_STORAGE_BUCKET`

   - `JWT_SECRET`

   - `SERVICE`: Email service to use to send account verification links, e.g. `gmail`.

   - `USER`: Email address that you will be using, e.g. `johndoe@gmail.com`.

   - `PASS`: The app password. For gmail accounts, please refer to this [link](https://support.google.com/accounts/answer/185833?hl=en).

   - `REDIS_URI`

4. A default admin account (`email: admin@gmail.com` and `password: Admin@123`) wil be created. If you wish to change the default credentials, update them in `.env`. Alternatively, you can also edit your credentials and user profile after you have created the default account.

5. To view the contents stored in Redis,

   1. Go to [http://localhost:5540](http://localhost:5540).

   2. Click on "Add Redis Database".

   3. Enter `host.internal.docker` as the Host.

## Running User Service without Docker

1. Set up and run Redis using `docker compose run --rm --name redis -p 6379:6379 redis`.

2. Open Command Line/Terminal and navigate into the `user-service` directory.

3. Run the command: `npm install`. This will install all the necessary dependencies.

4. Run the command `npm start` to start the User Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

## Running User Service Individually with Docker

1. Open the command line/terminal.

2. Run the command `docker compose run user-service` to start up the user service and its dependencies.

## After running

1. To view User Service documentation, go to http://localhost:3001/docs.

2. Using applications like Postman, you can interact with the User Service on port 3001. If you wish to change this, please update the `.env` file.
