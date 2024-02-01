
var downloadElement;
var uploadElement;

var amountDownloadTests = 1;
var amountUploadTests = 10;

function showDownloadSpeed(speed) {
    downloadElement.innerHTML = `${speed.toFixed(2)} MB/s`;
}

function showUploadSpeed(speed) {
    uploadElement.innerHTML = `${speed.toFixed(2)} MB/s`;
}

document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', async () => {
        let totalMebiDownloaded = 0;
        let totalTime = 0;

        for (let i = 0; i < amountDownloadTests; i++) {
            let start = new Date().getTime();

            await fetch('/download', {
                method: 'GET'
            }).then(async (response) => {
                let end = new Date().getTime();
                let time = (end - start) / 1000; // Convert milliseconds to seconds

                // Get the size from the response headers
                let size = response.headers.get('Content-Length');
                console.log(size);
                
                // Assuming 1 MB = 1048576 bytes
                let downloadedSizeInBytes = 1048576; // 1MB in bytes
                
                let downloadSpeed = downloadedSizeInBytes / time;

                let downloadSpeedKBps = downloadSpeed / 1024; // Convert bytes/s to KB/s
                let downloadSpeedMbps = downloadSpeed * 8 / 1000000; // Convert bytes/s to Mbps

                console.log("Download speed:\n" + downloadSpeed + " bytes/second \n" + downloadSpeedKBps + " KB/s \n" + downloadSpeedMbps + " Mbps");


            });
            

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }



    });
});
