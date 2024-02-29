require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user-routes.js");
const adminRoutes = require("./routes/admin-routes.js")

const app = express();
const port = 3000;

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Mercanto"

//MongoDb Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/", userRoutes);
app.use("/admin", adminRoutes)
app.use(cookieParser());
// Parse JSON bodies for this router
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const { downloadPrdtDrive } = require("./controllers/admin.controllers");

async function initializeServer() {
  console.log('Server is initializing...');

  await downloadPrdtDrive()
}


initializeServer()
  .then(() => {
    // Set up your routes and other server configurations
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error during server initialization:', error);
  });

