
var downloadElement;
var uploadElement;

var amountDownloadTests = 10;
var amountUploadTests = 10;

var downloadResults = [];
var uploadResults = [];

document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', () => {
        // Use Path /download which sends 10MB of random data to download the data and measure the time and then divide totalDownloadTime by amountDownloadTests to get the average time

        for (let i = 0; i < amountDownloadTests; i++) {
            let start = new Date().getTime();

            fetch('/download', {
                method: 'GET'
            }).then((response) => {
                let end = new Date().getTime();
                let time = end - start;
                downloadResults.push(time);
            });
        }

        // Calculate mb/s
        let totalDownloadTime = 0;
        downloadResults.forEach((result) => {
            totalDownloadTime += result;
        });

        let averageDownloadTime = totalDownloadTime / amountDownloadTests;
        let averageDownloadSpeed = 10 / (averageDownloadTime / 1000);
        
        document.getElementById('downloadSpeed').innerHTML = averageDownloadSpeed.toFixed(2) + ' MB/s';

    });
});
