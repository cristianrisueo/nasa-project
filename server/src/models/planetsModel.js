const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planetsMongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet },
      { keplerName: planet },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet: ${err}`);
  }
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data.kepler_name);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

module.exports = { loadPlanetsData, getAllPlanets };
