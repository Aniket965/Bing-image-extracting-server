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
      request("http://bing.com" + response.data.images[0].url)
        .on("response", rese => {
          // You can add/remove/modify headers here
          setHeadersForCacheLength(rese, 0);
        })
        .pipe(res);
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
    cacheControl = 'max-age=0, no-cache, no-store, must-revalidate'
    expires = nowGMTString
  } else {
    cacheControl = `max-age=${cacheLengthSeconds}, s-maxage=${cacheLengthSeconds}`
    expires = new Date(now.getTime() + cacheLengthSeconds * 1000).toGMTString()
  }

  res.headers['Date'] = nowGMTString
  res.headers['Cache-Control'] = cacheControl
  res.headers['Expires'] = expires
}

app.get("/unsplash1", (req, res) => {

  request("https://source.unsplash.com/random/800x400?space")
    .on("response", rese => {
      // You can add/remove/modify headers here
      setHeadersForCacheLength(rese, 0);
    })
    .pipe(res);
})

app.get("/unsplash2", (req, res) => {

  request("https://source.unsplash.com/random/800x200")
    .on("response", rese => {
      // You can add/remove/modify headers here
      setHeadersForCacheLength(rese, 0);
    })
    .pipe(res);
})
app.get("/randomsvg2.svg", (req, res) => {

  res.set('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate'); // 1 year

  console.log(`https://placeholder.pics/svg/${randomNumber(300, 400)}/`)
  request(`https://placeholder.pics/svg/${randomNumber(300, 400)}/`)
    .on("response", rese => {
      // You can add/remove/modify headers here
      setHeadersForCacheLength(rese, 0);
    })
    .pipe(res);
})
var port = process.env.PORT || 3001
app.listen(port, () => console.log("listening to the port ", port))