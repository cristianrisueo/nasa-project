const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const { loadPlanetsData } = require("./models/planetsModel");
const { loadLaunchesData } = require("./models/launchesModel");

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

mongoose.connection.once("open", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error(err));

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
  });

  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => console.log(`Server listening at port  ${PORT}`));
}

startServer();
