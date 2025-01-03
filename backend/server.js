const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    process.env.DB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/AuthRoutes");
const meetingRoutes = require("./routes/MeetingRoutes");
const filesRoutes = require("./routes/FileRoutes");

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", meetingRoutes);
app.use("/", filesRoutes);

const PORT = 6500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
