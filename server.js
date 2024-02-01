const express = require('express');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const randomData = crypto.randomBytes(1024 * 1024); // This is a block of 1MiB random data

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
app.get('/download', async (req, res) => {
    try {
        // Sets the headers for the download
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=download.bin');
        res.setHeader('Cache-Control', 'no-cache');

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

            //await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('Finished sending data');
        res.end();
    }
    catch (e) {
        console.log(e);
    }
});



// Upload route
app.post('/upload', (req, res) => {

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
