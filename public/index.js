
var downloadElement;
var uploadElement;

var amountDownloadTests = 10;
var amountUploadTests = 10;

var totalDownloadTime = 0;
var totalUploadTime = 0;

document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', () => {
        // Use Path /download which sends 10MB of random data to download the data and measure the time and then divide totalDownloadTime by amountDownloadTests to get the average time

        fetch('/download').then((response) => {
            let start = performance.now();
            response.arrayBuffer().then((buffer) => {
                let end = performance.now();
                totalDownloadTime += end - start;
                amountDownloadTests--;
                if (amountDownloadTests === 0) {
                    downloadElement.innerText = (totalDownloadTime / 10).toFixed(2) + 'ms';
                }
            });
        });

    });
});
