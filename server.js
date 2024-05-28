import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/authRoutes.js";
import swagger from './config/swagger.js'
import userRoutes from "./routes/userRoutes.js";

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
    // Assuming you've stored the token after login
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUwNmU3OWQ0ODViOTNkMmUxY2IwN2YiLCJpYXQiOjE3MTY1NTU0ODYsImV4cCI6MTcxOTE0NzQ4Nn0.p3eD_0-fgPmKy4IRsEpYrzHafQKcYiExi-9Zxy2_SlA";
    // req.headers.authorization = `Bearer ${token}`;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Application routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);

// Server listen
app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
