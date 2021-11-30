const axios = require("axios");
const config = require("../config.json");

const Fortnite = (info) => {
  this.username = info.username;
};

Fortnite.getStats = async (id) => {
  try {
    var options = {
      headers: {
        "x-rapidapi-host": config["x-rapidapi-host-fortnite"],
        "x-rapidapi-key": config["x-rapidapi-key"],
      },
    };

    let allStats = await axios.get(
      "https://fortnite-api.p.rapidapi.com/stats/" + id,
      options
    );

    let relevantStats = {
      wins: allStats.data.lifetime.all.all.placetop1,
      kdr: allStats.data.lifetime.all.all.kdr,
      kills: allStats.data.lifetime.all.all.kills,
    };
    return JSON.stringify(relevantStats);
  } catch (e) {
      throw e;
  }
};

module.exports = Fortnite;
