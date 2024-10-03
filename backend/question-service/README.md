# Question Service

> This guide references the [user-service README in the PeerPrep-UserService repository](https://github.com/CS3219-AY2425S1/PeerPrep-UserService/blob/main/user-service/README.md)

## Setting-up MongoDB

> :notebook: If you are familiar to MongoDB and wish to use a local instance, please feel free to do so. This guide utilizes MongoDB Cloud Services.

1. Set up a MongoDB Shared Cluster by following the steps in this [Guide](../user-service/MongoDBSetup.md).

2. After setting up, go to the Database Deployment Page. You would see a list of the Databases you have set up. Select `Connect` on the cluster you just created earlier.

   ![alt text](../user-service/GuideAssets/ConnectCluster.png)

3. Select the `Drivers` option, as we have to link to a Node.js App (Question Service).

   ![alt text](../user-service/GuideAssets/DriverSelection.png)

4. Select `Node.js` in the `Driver` pull-down menu, and copy the connection string.

   Notice, you may see `<password>` in this connection string. We will be replacing this with the admin account password that we created earlier on when setting up the Shared Cluster.

   ![alt text](../user-service/GuideAssets/ConnectionString.png)

5. In the `question-service` directory, create a copy of the `.env.sample` file and name it `.env`.

6. Update the `MONGO_URI` of the `.env` file, and paste the string we copied earlier in step 4.

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

6. In `.env` of question service, replace:
   - `FIREBASE_PROJECT_ID` with `project_id` found in the downloaded json file.
   - `FIREBASE_PRIVATE_KEY` with `private_key` found in the downloaded json file.
   - `FIREBASE_CLIENT_EMAIL` with `client_email` found in the downloaded json file.
   - `FIREBASE_STORAGE_BUCKET` with the folder path of the Storage. It should look something like `gs://<appname>.appspot.com`.

## Running Question Service

1. Follow the instructions [here](https://nodejs.org/en/download/package-manager) to set up Node v20.

2. Open Command Line/Terminal and navigate into the `question-service` directory.

3. Run the command: `npm install`. This will install all the necessary dependencies.

4. Run the command `npm start` to start the Question Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

5. To view Question Service documentation, go to http://localhost:3000/docs.

6. Using applications like Postman, you can interact with the Question Service on port 3000. If you wish to change this, please update the `.env` file.
