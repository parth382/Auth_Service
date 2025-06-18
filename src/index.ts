import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToDatabase } from "./config/dataSource";
import apiRoutes from "./routes/routeindex";
import { createV1Router } from "./routes/v1/v1index";

dotenv.config();

const PORT = process.env.PORT || 3700;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();

    // Middleware
    
    app.use('/api', apiRoutes);

    app.use('/api/v1', createV1Router());

    // // Basic health check route
    // app.get('/health', (req, res) => {
    //   res.json({ status: 'ok', message: 'Server is running' });
    // });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
