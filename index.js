const https = require('https');
const express = require('express');
const app = express();
const port = 80;
const cheerio = require('cheerio');

app.use(express.static('public'));

app.get('/', (req, res) => {
  var host = "http://" + req.hostname;
  res.send({
    "premiere": host + "/Premiere",
    "terminale": host + "/Terminale",
    "nsi": host + "/NSI",
    "bcpst": host + "/BCPST"
  })
});

app.get('/:page', (req, res) => {
  let page = req.params.page;
  https.get('https://mathgreen.fr/' + page + ".html", (resp) => {
    var data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var $ = cheerio.load(data);
      var links = [];
      for (var item in $("a")) {
        if ($("a")[item]["children"] != undefined) if ($("a")[item]["children"][0] != undefined) if ($("a")[item]["children"][0]["data"] != undefined) if ($("a")[item]["children"][0]["data"].trim() != "") if ($("a")[item]["attribs"]["href"] != undefined) if ($("a")[item]["attribs"]["href"] != "http://creativecommons.org/licenses/by-nc-sa/4.0/") {
          links.push({"name": $("a")[item]["children"][0]["data"].trim(), "url": "http://mathgreen.fr/" + $("a")[item]["attribs"]["href"]});
        }
      }
      res.send(links);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

app.listen(port, () => {
  console.log(`Mathgreen API Server listening at port ${port}`);
});
