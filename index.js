require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

mongoose.connect(
  process.env.MONGO,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  () => {
    try {
      console.log("Database connected...");
    } catch (e) {
      console.log(`Error:${e.message}`);
    }
  }
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.resolve(__dirname, "public")));
app.use(fileUpload());
app.use(require("./routes/index"));

app.use(express.static(path.resolve(__dirname, "client", "build")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

app.listen(process.env.PORT, () => {
  try {
    console.log("Server initialised...");
  } catch (e) {
    console.log(`Error:${e.message}`);
  }
});
