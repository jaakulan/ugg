const axios = require("axios");
const config = require("../config.json");

const Apex = (info) => {
  this.id = info.id;
  this.platform = platform;
};

Apex.getStats = async (id, platform) => {
  try {
    var options = {
      headers: {
        "x-rapidapi-host": config["x-rapidapi-host-apex"],
        "x-rapidapi-key": config["x-rapidapi-key"],
      },
    };

    let allStats = await axios.get(
      "https://apex-legends.p.rapidapi.com/stats/" + id + "/" + platform,
      options
    );
    // just add some error checking to see if allstats.data exists
    // if not throw an error or just wrap above call in a try catch
    let relevantStats = {
      level: allStats.data.global.level,
      legend: allStats.data.legends.selected.LegendName,
      rank:
        allStats.data.global.rank.rankName +
        " Div: " +
        allStats.data.global.rank.rankDiv,
    };
    console.log(relevantStats);
    return JSON.stringify(relevantStats);
  } catch (e) {
    throw e;
  }
};
module.exports = Apex;
