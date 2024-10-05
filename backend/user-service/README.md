# User Service Guide

> If you have not set-up either a local or cloud MongoDB, go [here](../README.md) first before proceding.

## Setting-up

1. In the `user-service` directory, create a copy of the `.env.sample` file and name it `.env`.

2. Update `MONGO_CLOUD_URI`, `MONGO_LOCAL_URI`, `JWT_SECRET`. 

3. A default admin account (`email: admin@gmail.com` and `password: Admin@123`) wil be created. If you wish to change the default credentials, update them in `.env`. Alternatively, you can also edit your credentials and user profile after you have created the default account.

## Running User Service

1. Follow the instructions [here](https://nodejs.org/en/download/package-manager) to set up Node v20.

2. Open Command Line/Terminal and navigate into the `user-service` directory.

3. Run the command: `npm install`. This will install all the necessary dependencies.

4. Run the command `npm start` to start the User Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

5. To view User Service documentation, go to http://localhost:3001/docs.

6. Using applications like Postman, you can interact with the User Service on port 3001. If you wish to change this, please update the `.env` file.
