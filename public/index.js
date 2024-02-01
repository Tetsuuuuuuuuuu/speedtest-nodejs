
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
                let time = end - start;

                // get the data from the response body
                let data = await response.arrayBuffer();
                let size = data.byteLength;

                let speed = size / time; // bytes per millisecond
                
                console.log(`Download speed: ${speed} bytes/ms`);
               
                
            });

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }



    });
});
