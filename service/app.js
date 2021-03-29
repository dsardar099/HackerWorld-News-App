const fetch = require("node-fetch");
const cors = require("cors");
const urlMetadata = require("url-metadata");

const express = require("express");
const app = express();

// Get id of the news
const getData = async (url) => {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Can not fetch data!!");
  }
  const data = await response.json();
  return data;
};


// Get details for all the news id
async function getDetails(id) {
  const pArray = id.map(async (i) => {
    let response = await fetch(
      "https://hacker-news.firebaseio.com/v0/item/" + i + ".json?print=pretty"
    );
    return response.json();
  });
  const news = await Promise.all(pArray);
  return news;
}

// For cors
app.use(cors());

// Handle get request for /
app.get("/", (req, res) => {
  res.send("Home");
});

// Handle get request for top stories
app.get("/api/topstories", (req, res) => {
  getData("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then((data) => getDetails(data))
    .then((news) => {
      res.send(news);
    })
    .catch((err) => console.log("Rejected:", err));
});

// Handle get request for new stories
app.get("/api/newstories", (req, res) => {
  getData("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
    .then((data) => getDetails(data))
    .then((news) => {
      res.send(news);
    })
    .catch((err) => console.log("Rejected:", err));
});

// Handle get request for best stories
app.get("/api/beststories", (req, res) => {
  getData("https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty")
    .then((data) => getDetails(data))
    .then((news) => {
      res.send(news);
    })
    .catch((err) => console.log("Rejected:", err));
});

// Handle get request for particular id
app.get("/api/stories/:id", (req, res) => {
  const data = [parseInt(req.params.id)];

  getDetails(data)
    .then((news) => {
      res.send(news);
    })
    .catch((err) => console.log("Rejected:", err));
});

// To set port in system manually
// set PORT=5000

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to the port ${port}...`));
