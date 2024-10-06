import app from "./app.ts";
import connectDB from "./config/db.ts";

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      console.log("MongoDB connected");

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
}
