const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morganMiddleware = require("./middlewares/logger");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const APIRoutes = require("./routes/v1");

const port = 3002;

const app = express();

// In Prod we should specify which domains to allow incoming requests from
// Example:
// app.use(cors({ origin: ['https://socotec.com', 'https://socotec-monitoring.com'] }));
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(morganMiddleware);
app.get("/health", (req, res) => res.send({ message: "ok" }));

// Utiliser les routes sous la route parent `/api/users`
app.use("/api/v1", APIRoutes);

const server = app.listen(port, () => {
  console.log(`Datatys App running on port ${port}.`);
});
module.exports = server;
