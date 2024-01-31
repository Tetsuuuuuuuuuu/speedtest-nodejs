const express = require('express');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const randomData = crypto.randomBytes((1024 * 1024) * 10); // This is a block of 10MiB random data

var privateKey = null;
var certificate = null;

app.use('/.well-known', express.static(path.join(__dirname, ".well-known")))
app.use('/public', express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")

// Parses command line arguments
let args = process.argv;
let host, httpPort, httpsPort, privateKeyPath, certificatePath;
args.forEach((arg, index) => {
  if (arg === '--server-ip' && index < args.length - 1) {
    host = args[index + 1];
  } else if (arg === '--server-httpPort' && index < args.length - 1) {
    httpPort = args[index + 1];
  } else if (arg === '--server-httpsPort' && index < args.length - 1) {
    httpsPort = args[index + 1];
  } else if (arg === '--server-privateKey' && index < args.length - 1) {
    privateKeyPath = args[index + 1];
  } else if (arg === '--server-certificate' && index < args.length - 1) {
    certificatePath = args[index + 1];
  }
});

// Sets default values for command line arguments
if (!host) {
  host = '0.0.0.0';
}
if (!httpPort) {
  httpPort = 80;
}
if (httpsPort) {
  privateKey = fs.readFileSync(privateKeyPath);
  certificate = fs.readFileSync(certificatePath);
}

// Render index page
app.get("/", (req, res) => {
  res.render("index.ejs")
});


// Implement Download and Upload routes

// Download route
app.get('/download', (req, res) => {
  // Start measuring time
  const startTime = process.hrtime();

  // Set response headers
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', 'attachment; filename=random-data.bin');

  // Send random data
  res.send(randomData);

  // End measuring time
  const endTime = process.hrtime(startTime);

  // Calculate download speed
  const elapsedTime = endTime[0] + endTime[1] / 1e9; // in seconds
  const fileSizeMB = randomData.length / 1024 / 1024; // in MB
  const downloadSpeedMBps = fileSizeMB / elapsedTime;

  console.log(`Download speed: ${downloadSpeedMBps.toFixed(2)} MB/s`);
});

// Upload route
app.post('/upload', (req, res) => {
  const startTime = process.hrtime();

  let dataReceived = 0;

  req.on('data', (chunk) => {
    dataReceived += chunk.length;
  });

  req.on('end', () => {
    const endTime = process.hrtime(startTime);

    const elapsedTime = endTime[0] + endTime[1] / 1e9; // in seconds
    const uploadSpeedMBps = dataReceived / 1024 / 1024 / elapsedTime; // in MB/s

    console.log(`Upload speed: ${uploadSpeedMBps.toFixed(2)} MB/s`);
    res.sendStatus(200);
  });
});




// Creates a HTTP & a HTTPS web server with the specified options
http.createServer(app).listen(httpPort, host, () => {
  console.log('Hosting speedtest server on httpPort ' + httpPort + ', host ' + host);
});

if (privateKey && certificate) {
  https.createServer({ key: privateKey, cert: certificate }, app).listen(httpsPort, host, () => {
    console.log('Hosting speedtest server on httpsPort ' + httpsPort + ', host ' + host);
  });
}
