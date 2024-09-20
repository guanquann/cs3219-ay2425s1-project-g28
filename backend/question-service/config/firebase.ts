import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import serviceAccount from "../firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://peerprep-c3bd1.appspot.com",
});

const bucket = admin.storage().bucket();

const uploadFileToFirebase = async (
  file: Express.Multer.File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = uuidv4();
    const ref = bucket.file(fileName);

    const blobStream = ref.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", async () => {
      try {
        await ref.makePublic();
        resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
};

export { bucket, uploadFileToFirebase };
