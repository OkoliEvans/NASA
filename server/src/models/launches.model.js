const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2045"),
  target: "Kepler-442 b",
  customers: ["NASA", "NOAA", "5TZ"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDb.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb
  .findOne()
  .sort('-flightNumber');// adding the '-' sign sorts the data in descending order (from highest to lowest)

  if  (!latestLaunch) {
    return DEFAULT_FIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDb.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found!');
  }

  await launchesDb.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Apache', 'IEEE', 'CERN'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDb.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
