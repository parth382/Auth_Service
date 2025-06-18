import "reflect-metadata";  // Required by TypeORM
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../model/User";
import { Roles } from "../model/Roles";
// Load environment variables from .env file
dotenv.config();

// Database connection options
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"), // PostgreSQL default port
  username: process.env.DB_USERNAME, // Replace with your DB username
  password: process.env.DB_PASSWORD, // Replace with your DB password
  database: process.env.DB_NAME, // Replace with your database name
  synchronize: true, // Automatically synchronize entities with the DB (useful in development mode , keep it false in production mode)
  logging: true,
  entities: [User,Roles],
  subscribers: [], // List of entities to load
});

export const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error during datasource initialization:", error);
    process.exit(1); // Exit if database connection fails
  }
};

export default AppDataSource;
