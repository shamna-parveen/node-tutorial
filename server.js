import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/authRoutes.js";
import swagger from './config/swagger.js';
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST || "localhost";
app.set("view engine", "ejs");

// Importing mongodb connection
connectDB();
app.use(express.json());

// Rendering index page
app.get("/", (req, res) => {
  res.render("index");
});

const specs = swaggerJsdoc(swagger);

// Serve Swagger UI with Bearer Token authentication
app.use(
  "/api/documentation",
  (req, res, next) => {
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Application routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes); // Ensure this is the correct route path

// Server listen
app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
