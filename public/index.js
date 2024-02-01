
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

                console.log('Downloaded 10MB in ' + time + 'ms')
            });
        }

        // Calculate mb/s
        let totalDownloadTime = 0;
        downloadResults.forEach((result) => {
            totalDownloadTime += result;
        });

        console.log('Total download time: ' + totalDownloadTime);

        let averageDownloadTime = totalDownloadTime / amountDownloadTests;

        console.log('Average download time: ' + averageDownloadTime);

        let averageDownloadSpeed = 10 / (averageDownloadTime / 1000);

        console.log('Average download speed: ' + averageDownloadSpeed);
        
        document.getElementById('downloadSpeed').innerHTML = averageDownloadSpeed.toFixed(2) + ' MB/s';

    });
});
