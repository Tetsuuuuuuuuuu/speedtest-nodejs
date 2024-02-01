
var downloadElement;
var uploadElement;

var amountDownloadTests = 10;
var amountUploadTests = 10;


document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', async () => {
        let totalBytesDownloaded = 0;
        let totalTime = 0;

        for (let i = 0; i < amountDownloadTests; i++) {
            let start = new Date().getTime();

            await fetch('/download', {
                method: 'GET'
            }).then(async (response) => {
                let end = new Date().getTime();
                let time = end - start;

                // Measure the size of the downloaded response
                let contentLength = parseInt(response.headers.get('Content-Length'));
                totalBytesDownloaded += contentLength;

                totalTime += time;

                let speed = contentLength / (time / 1000); // Calculate speed in bytes per second
                // Convert speed to megabytes per second
                let speedInMBps = (speed / 1024) / 1024; // Convert bytes per second to megabytes per second
                console.log(`Download speed: ${speedInMBps.toFixed(2)} MB/s`);

                // Optionally, you can also calculate and log the average speed across all tests
                let averageSpeed = totalBytesDownloaded / (totalTime / 1000);
                let averageSpeedInMBps = (averageSpeed / 1024) / 1024; // Convert bytes per second to megabytes per second
                console.log(`Average download speed: ${averageSpeedInMBps.toFixed(2)} MB/s`);
            });

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }



    });
});
