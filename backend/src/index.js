require("dotenv").config();
const app = require("./app");
const connectDB = require("./DB/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 TransitOps API running on http://localhost:${PORT}`);
  });
};

start();
