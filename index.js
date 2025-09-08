import express from "express"; // if using ES modules
// const express = require("express"); // if using CommonJS
import { globalErrorHandler } from "./src/utils/globalErrorHandler.js";
const app = express();
const PORT =process.env.PORT;

app.use(express.json());
// Define a simple route
app.get("/home", async (req, res) => {
  res.send("Server ready.....!");
});

// Routes
import router from "./src/routes/index.js"; 
app.use("/api", router);

// Catch-all middleware for invalid routes
// app.use("*", (req, res) => {
//    sendError(res, "Invalid route", HTTPStatusCode.NOT_FOUND);
// });

import { connectDB } from "./src/config/dbConnection.js";
import { sendError } from "./src/utils/responseHelper.js";
import HTTPStatusCode from "./src/utils/httpStatusCode.js";

connectDB();
app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
