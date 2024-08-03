const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require('mongoose');

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true
  })
);

const db = require("./models");
db.mongoose
  .connect('mongodb://localhost:27017/library')
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the library system application." });
});

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
app.use('/api', signupRoute);
app.use('/api', loginRoute);

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
