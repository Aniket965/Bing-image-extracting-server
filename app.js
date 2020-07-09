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

function randomNumber(min, max) {  
  return Math.random() * (max - min) + min; 
}  

function setHeadersForCacheLength(res, cacheLengthSeconds) {
  const now = new Date()
  const nowGMTString = now.toGMTString()

  // Send both Cache-Control max-age and Expires in case the client implements
  // HTTP/1.0 but not HTTP/1.1.
  let cacheControl, expires
  if (cacheLengthSeconds === 0) {
    // Prevent as much downstream caching as possible.
    cacheControl = 'no-cache, no-store, must-revalidate'
    expires = nowGMTString
  } else {
    cacheControl = `max-age=${cacheLengthSeconds}, s-maxage=${cacheLengthSeconds}`
    expires = new Date(now.getTime() + cacheLengthSeconds * 1000).toGMTString()
  }

  res.setHeader('Date', nowGMTString)
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Expires', expires)
}

app.get("/unsplash", (req, res) => {
  request("https://source.unsplash.com/random/800x400?space").pipe(res);
})
app.get("/randomsvg.svg", (req, res) => {
  setHeadersForCacheLength(res,5);
console.log(`https://placeholder.pics/svg/${randomNumber(300,400)}/`)
  request(`https://placeholder.pics/svg/${randomNumber(300,400)}/`).pipe(res);
})
var port = process.env.PORT || 3001
app.listen(port, () => console.log("listening to the port ", port))