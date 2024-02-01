<p align="center">
  <img width="300" height="300" src="https://github.com/Tetsuuuuuuuuuu/speedtest-nodejs-website/assets/72413576/b378dcc8-0adc-4b1f-b424-7510a762fb46">
</p>
<h1>Speedtest-NodeJS-Website</h1>
<h5>This is a fork of https://github.com/sloshy/speedtest-nodejs</h5>

<h2>What is this</h2>

<a href="speedtest.peer2.live">Live Demo</a>

This project allows anyone to setup his own http and https speedtesting Website quick and simple.

<h2>Installation</h2>
Install <a href="https://nodejs.org/en/">[NodeJS 6.9.x]</a> if you haven't already on your machine.

Clone this repository locally and run `npm install` to set up dependencies.

<h2>Usage</h2>

Run `node server.js` on the machine you wish to use as the server.
Use the following command line arguments to customize its settings:

<ul>
  <li>`--server-ip` - Set a string representing the IPv6 or IPv4 allowed hostname.  ('0.0.0.0' by default, allowing all IPv4 hostnames)</li>
  <li>`--server-httpPort` - Set the port the HTTP server will listen on.  (80 by default)</li>
  <li>`--server-httpsPort` - Set the port the HTTPS server will listen on.  (443 by default)</li>
  <li>`--server-privateKey` - Sets the path of the private key used for the HTTPS server.  (no default)</li>
  <li>`--server-certificate` - Sets the path of the certificate used for the HTTPS server.  (no default)</li>
</ul>

If you ignore the --server-ip, --server-httpPort or --server-httpsPort they will be set to their defaults.

<h3>If either the --server-privateKey or --server-certificate are not parsed only the http server will start. To enable https I recommend using <a href="https://certbot.eff.org/">certbot</a> to generate free a free ssl certificate. The required .well-known path is public by default.</h3>

If either the private key or the certificate can not be found the server will throw an exception on startup.

<h2>Speed Test Information</h2>
Once a client starts a speed test, it will begin downloading 100MiB of random data.
If the download takes longer than 15 seconds, the server will close the connection early.

After the download speed test, it will begin uploading 10MiB of random data.
Once all of the data is uploaded, the client will determine the estimated
upload speed.

The standard rate limit is 50 requests per minute.

<h2>Customization</h2>
<ul>
  <li>To change the icon on the website to your own, just replace the file "logo.png" in the "public" folder with your own. Make sure the new file has the same name and file format or to change it accordingly in the css code.</li>
  <li>To replace the favicon replace the favicon.ico in the "public" folder with your own. Make sure the new file has the same name and file format.</li>
</ul>

<h2>Example</h2>
Example https server starting string:
<br><br>

```diff
node server.js --server-privateKey /etc/letsencrypt/live/speedtest.peer2.live/privkey.pem --server-certificate /etc/letsencrypt/live/speedtest.peer2.live/cert.pem
```

<h2>Notes</h2>

This is the first time I created such a project, so it is possible this server still has bugs, I am continuesly trying to improve this project. All community improvements are welcomed.

This Project uses:
<ul>
  <li>EJS 3.1.9</li>
  <li>Express 4.14.1</li>
  <li>Express-rate-limit 7.1.5</li>
  <li>FS 0.0.1-security</li>
  <li>Https 1.0.0</li>
  <li>Multer 1.4.5-lts.1</li>
  <li>Path 0.12.7</li>
</ul>

All other functionality is provided by the standard Node APIs.

