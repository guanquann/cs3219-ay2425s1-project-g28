import app from "./app.ts";

const PORT = process.env.PORT || 3002;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `Matching service server listening on http://localhost:${PORT}`
    );
  });
}
