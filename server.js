const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const { APILimiter } = require("./utils/limiters");
const { errorHandler } = require("./middleware/errorMiddleware");

const postsRoute = require("./routes/postRoutes");
const draftsRoute = require("./routes/draftRoutes");
const usersRoute = require("./routes/userRoutes");
const cloudinaryRoute = require("./routes/cloudinaryRoutes");

dotenv.config();

//Connect to DB
connectDB();

const app = express();

// Middleware
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit number of API requests
app.use("/api", APILimiter);

// Body parser and file upload
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());

// Data sanitization
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessSatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/posts", postsRoute);
app.use("/api/drafts", draftsRoute);
app.use("/api/users", usersRoute);
app.use("/api/cloudinary", cloudinaryRoute);

if (process.env.NODE_ENV === "production") {
  console.log("In production!");
  app.use(express.static(path.join(path.resolve(), "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(path.resolve(), "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/"),
    (req, res) => {
      res.send("API is running");
    };
}

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is live!"));
