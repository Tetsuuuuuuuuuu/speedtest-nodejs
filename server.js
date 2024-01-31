const express = require('express');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
const app = express();
const randomData = crypto.randomBytes(1024 * 1024); // This is a block of 1MiB random data
const fs = require("fs")

var privateKey = fs.readFileSync("ssl/key.pem");
var certificate = fs.readFileSync("ssl/cert.pem");

app.use('/.well-known', express.static(path.join(__dirname, ".well-known")))

// Set the host and port if supplied
let args = process.argv;
let host, path, port;
args.forEach((arg, index) => {
  if (arg === '--server-ip' && index < args.length - 1) {
    host = args[index + 1];
  } else if (arg === '--server-path' && index < args.length - 1) {
    path = args[index + 1];
  } else if (arg === '--server-httpPort' && index < args.length - 1) {
    port = args[index + 1];
  }else if (arg === '--server-httpsPort' && index < args.length - 1) {
    port = args[index + 1];
  }
});

// If options are not supplied, set sane defaults
if (!host) {
  host = '0.0.0.0';
}
if (!httpPort) {
  port = 80;
}
if (!httpsPort) {
  port = 443;
}
if (!path) {
  path = '*';
}

// Sends random data to client
app.get(path, (req, res) => {
  console.log("Sending data...");
  let baseTime = new Date().getTime();

  // Sends up to 100MiB or for 15 seconds, whichever comes first.
  for (let i = 0; i < 100; i++) {
    let currentTime = new Date().getTime();
    if (currentTime - baseTime > 15000) {
      console.log('15s elapsed');
      break;
    }
    res.write(randomData);
  }
  console.log('Finished sending data');
  res.end();
});

// Receives uploaded data from client
app.post('*', (req, res) => {
  console.log('Receiving data...');
  let baseTime = new Date().getTime();
  let dataSize = 0;

  // Each time data is received, report the number of bits each second
  req.on('data', (data) => {
    dataSize += data.length;
    let currentTime = new Date().getTime();
    if (currentTime - baseTime > 1000) {
      console.log('Received ' + (dataSize * 8) + ' bits');
    }
  });

  // When all data is received, log it and close the connection;
  req.on('end', () => {
    console.log('Received ' + (dataSize * 8) + ' bits');
    res.sendStatus(200);
  })
});

// Creates a HTTP & a HTTPS web server with the specified options
http.createServer(app).listen(httpPort, host, () => {
  console.log('Hosting speedtest server on port ' + port + ', host ' + host + ', and path ' + path);
});

https.createServer({key: privateKey, cert: certificate}, app).listen(httpsPort, host, () => {
  console.log('Hosting speedtest server on port ' + port + ', host ' + host + ', and path ' + path);
});
