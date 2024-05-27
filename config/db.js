import mongoose from "mongoose";
import databaseSeeder from "../seeds/databaseSeeder.js";

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DATABASE_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      databaseSeeder();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  export default connectDB;