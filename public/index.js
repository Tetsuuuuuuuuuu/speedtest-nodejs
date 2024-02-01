
var downloadElement;
var uploadElement;

var amountDownloadTests = 10;
var amountUploadTests = 10;


document.addEventListener("DOMContentLoaded", (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', async () => {
        let downloadSpeeds = [];
        
        for (let i = 0; i < amountDownloadTests; i++) {
            let start = new Date().getTime();

            await fetch('/download', {
                method: 'GET'
            }).then((response) => {
                let end = new Date().getTime();
                let time = end - start;
                downloadResults.push(time);

                // this is what we downloaded: crypto.randomBytes(10 * (1024 * 1024))

                let speed = (10 * (1024 * 1024)) / time;
                console.log(`Download speed: ${speed} MB/s`);
            });
        }


    });
});
