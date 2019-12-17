/*
Title:                      Simple Address Book
Language:                   NodeJS
Download Location:          https://github.com/tpeterson66/portable
*/

require('dotenv').config()
// Required in .env file, app will not run correctly without the .env file...
var env = process.env.ENV || "env not set!"
var port = process.env.PORT || 3000
var token = process.env.TOKEN

// Imported NPM packages, must run NPM install before running the app
const express = require('express'); // NodeJS web server middleware
const axios = require('axios'); // Used to make http requests
const fs = require('fs'); // built-in - used to interact with the filesystem
const path = require('path'); // built-in - used to format paths easier
const os = require('os'); // built-in - used to interact with the OS

// Configure express
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Homepage
app.get('/', (req, res) => {
  var clientIP = req.connection.remoteAddress
  var sample = JSON.parse(fs.readFileSync('address-book.json'));
  res.render('pages/index', {sample,env,clientIP})
});

// API to pull fresh data
app.get('/api/fresh', async (req, res) => {
  let payload = {
    token,
    data: {
      name: "nameFirst",
      email: "internetEmail",
      phone: "phoneHome",
      _repeat: 10 // will only render 10 at a time!
     }
  }

  try {
    const response = await axios({
      method: "post",
      url: "https://app.fakejson.com/q",
      data: payload
    });
    res.send(response.data)
  } catch (err) {
    res.send(err)
  }
});

// API call to return the stored file, used to make a bunch of requests to the api
app.get('/api/bulk', (req, res) => {
  var sample = JSON.parse(fs.readFileSync('address-book.json'));
  res.send(sample)
})

// API call to get details about the node running the app!
app.get('/api/status', async (req, res) => {
  var hostname = os.hostname()
  var uptime = os.uptime()
  res.send({
    hostname, uptime
  })
})

app.listen(port, () => {
  console.log(`Web server started on *:${port}`)
})