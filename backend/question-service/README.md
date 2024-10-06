# Question Service

> If you have not set-up either a local or cloud MongoDB, go [here](../README.md) first before proceding.

## Setting-up Firebase

1. Go to https://console.firebase.google.com/u/0/.

2. Create a project and choose a project name. Navigate to `Storage` and click on it to activate it.

3. Select `Start in production mode` and your preferred cloud storage region.

4. After Storage is created, go to `Rules` section and set rule to:

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

   This rule ensures that only verified users can upload images while ensuring that URLs of images are public. Remember to click `Publish` to save changes.

5. Go to `Settings`, `Project settings`, `Service accounts` and click `Generate new private key`. This will download a `.json` file, which will contain your credentials.

## Setting-up Question Service

1. In the `question-service` directory, create a copy of the `.env.sample` file and name it `.env`.

2. To connect to your cloud MongoDB instead of your local MongoDB, set the `NODE_ENV` to `production` instead of `development`.

3. Update `MONGO_CLOUD_URI`, `MONGO_LOCAL_URI`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_STORAGE_BUCKET`.
   - `FIREBASE_PROJECT_ID` is the value of `project_id` found in the downloaded json file.
   - `FIREBASE_PRIVATE_KEY` is the value of `private_key` found in the downloaded json file.
   - `FIREBASE_CLIENT_EMAIL` is the value of `client_email` found in the downloaded json file.
   - `FIREBASE_STORAGE_BUCKET` is the folder path of the Storage. It should look something like `gs://<appname>.appspot.com`.

## Running Question Service without Docker

1. Follow the instructions [here](https://nodejs.org/en/download/package-manager) to set up Node v20.

2. Open Command Line/Terminal and navigate into the `question-service` directory.

3. Run the command: `npm install`. This will install all the necessary dependencies.

4. Run the command `npm start` to start the Question Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

## Seeding questions into MongoDB

1. With Docker

   - Run `docker ps` to get a list of the Docker containers on your machine.
   - Retrieve the `CONTAINER_ID` of `peerprep/question-service`.
   - Run `docker exec -it <CONTAINER_ID> npm run seed`.

2. Without Docker

   - Run `npm run seed`.

## After running

1. To view Question Service documentation, go to http://localhost:3000/docs.

2. Using applications like Postman, you can interact with the Question Service on port 3000. If you wish to change this, please update the `.env` file.
