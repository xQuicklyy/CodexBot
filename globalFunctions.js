const globalFunctions = {
  getGif: async function (query, limit, variable) {
    const fetch = require("node-fetch");
    const giphy = await fetch(
      `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=tMrpjdvM7PZMnadO8OFzQ7dt9ipQZLkY&limit=1`
    ).then((response) => response.json());
    return giphy.data[Math.floor(Math.random() * Math.floor(giphy.data.length))]
      .images.original.url;
  },
  getImage: function (message, query, random) {
    const request = require("request");
    const cheerio = require("cheerio");
    var options = {
      url: `https://results.dogpile.com/serp?qc=images&q=${query}`,
      method: "GET",
      headers: {
        Accept: "text/html",
        "User-Agent": "Chrome",
      },
    };

    request(options, function (error, response, responseBody) {
      if (error) {
        return;
      }
      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      var urls = new Array(links.length)
        .fill(0)
        .map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) {
        return;
      }
      let index = 1;
      if (random) {
        index = Math.floor(Math.random() * urls.length);
      }
      message.channel.send(urls[index]);
    });
  },
};
exports.data = globalFunctions;