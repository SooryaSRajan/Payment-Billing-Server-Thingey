require("dotenv").config();
const app = require("express")();
const http = require('http')
const server = http.createServer(app)

const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./utils/config");
const { connectMongo } = require("./db/mongo");
const logger = require("./utils/logger");
const router = require("./routes/routes");

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
}); // returns body for logging
//mongo

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(router);
//error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  connectMongo();
});