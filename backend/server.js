const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const analyticsRoutes = require("./routes/analyticsRoutes");

const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && !process.env.API_WRITE_KEY) {
  throw new Error("API_WRITE_KEY must be configured in production to protect API access.");
}

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

const requireApiKey = (req, res, next) => {
  if (!process.env.API_WRITE_KEY) return next();
  if (req.get("x-api-key") !== process.env.API_WRITE_KEY) {
    return res.status(401).json({ message: "A valid API key is required." });
  }
  return next();
};

app.use("/api", requireApiKey);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AI E-Commerce Intelligence Platform API is running!",
  });
});

app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? "ok" : "not_ready", database: connected ? "connected" : "disconnected" });
});

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  console.error("Unhandled request error:", error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required.");
}

let server;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    server = app.listen(port, "0.0.0.0", () => console.log(`Backend server listening on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`${signal} received; shutting down`);
  if (server) server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
  else mongoose.disconnect().finally(() => process.exit(0));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
