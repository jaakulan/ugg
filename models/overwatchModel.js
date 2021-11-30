const ow = require("overwatch-stats-api");

const Overwatch = (info) => {
  this.id = info.id;
  this.platform = platform;
};

Overwatch.getStats = async (id, platform) => {
  try {
    const stats = await ow.getAllStats(id, platform);

    characters = stats.mostPlayed.competitive;
    let hero = "";
    for (let key in characters) {
      hero = key;
      break;
    }

    console.log(stats.heroStats.competitive.overall.game);

    let relevantStats = {
      level: "Prestige " + stats.prestige + " level " + stats.level,
      hero: hero,
      wins: stats.heroStats.competitive.overall.game.games_won,
    };
    return JSON.stringify(relevantStats);
  } catch (e) {
    throw e;
  }
};

module.exports = Overwatch;
