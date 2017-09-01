var express = require('express');
var axios = require('axios');
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
      res.send({
        url: "http://bing.com" + response.data.images[0].url
      });
    })
    .catch(function (error) {
      console.log(error);
    });
})
var port = process.env.PORT || 3001
app.listen(port, () => console.log("listening to the port ", port))