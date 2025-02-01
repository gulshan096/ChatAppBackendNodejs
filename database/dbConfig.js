import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import logger from "../logger.js";

configDotenv();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`Database Connected: ${DB_NAME}`);
    logger.info("Database Connected");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
