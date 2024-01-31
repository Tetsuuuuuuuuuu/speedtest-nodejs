const express = require('express');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const randomData = crypto.randomBytes(1024 * 1024); // This is a block of 1MiB random data

var privateKey = null;
var certificate = null;

app.use('/.well-known', express.static(path.join(__dirname, ".well-known")))
app.use('/public', express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")

// Enable CORS for all routes
app.use(cors());

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

// Endpoint to download the test file
app.get("/download", (req, res) => {
  const fileSize = randomData.length;

  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': fileSize
  });

  // Create a readable stream from the random data
  const stream = require('stream');
  const readable = new stream.Readable();
  readable.push(randomData);
  readable.push(null); // Signal the end of the stream

  // Pipe the data to the response
  readable.pipe(res);
});

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const fileSize = req.file ? req.file.size : 0; // Get file size from the uploaded file

  res.status(200).send({ fileSize });
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
