const http = require("http");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");

const app = require("./app");
const e = require("express");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

startServer();
//sudo killall -9 node