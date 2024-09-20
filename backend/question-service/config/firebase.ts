import admin from "firebase-admin";
import serviceAccount from "../firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://peerprep-c3bd1.appspot.com",
});

const bucket = admin.storage().bucket();

export { bucket };
