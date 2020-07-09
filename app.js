var express = require('express');
var axios = require('axios');
const request = require('request');
var app = express();
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
next();
}

app.use(allowCrossDomain);

app.get("/", (req, res) => {
  axios.get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US')
    .then(function (response) {
      request("http://bing.com" + response.data.images[0].url).pipe(res);
    })
    .catch(function (error) {
      console.log(error);
    });
})


app.get("/unsplash", (req, res) => {
  request("https://source.unsplash.com/random/800x400?space").pipe(res);
})
var port = process.env.PORT || 3001
app.listen(port, () => console.log("listening to the port ", port))