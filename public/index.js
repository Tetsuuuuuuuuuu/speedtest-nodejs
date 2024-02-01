
var downloadElement;
var uploadElement;

document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', () => {
        // Use Path /download which sends 10MB of random data to test download speed
        let downloadStartTime = new Date();

        fetch('/download')
            .then(response => {
                let downloadEndTime = new Date();
                let downloadTime = downloadEndTime - downloadStartTime;
                let downloadSpeed = 10 / (downloadTime / 1000);

                downloadElement.innerHTML = `${downloadSpeed.toFixed(2)} MB/s`;
            });
    });
});
