import express from "express";
import httpStatus from "http-status";
import { connectDB } from "./src/config/dbConnection.js";
import { globalErrorHandler } from "./src/utils/globalErrorHandler.js";
import router from "./src/routes/index.js";
import cors from "cors"
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: "*",
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// Test route
app.get("/home", (req, res) => {
  res.send("Server ready.....!");
});

// Main routes
app.use("/api", router);

// Handle unknown routes
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Route '${req.originalUrl}' not found`,
  });
});

// Global error handler
app.use(globalErrorHandler);

// Start server only after DB connection
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
})();
