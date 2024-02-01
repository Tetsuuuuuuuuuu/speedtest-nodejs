
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

                setInterval(() => {
                    console.log(response.blob())
                }, 1000);

                // This downloaded 1 MebiByte (1024)

                totalMebiDownloaded += 1;
                totalTime += time;

                console.log(`Downloaded 1 MebiByte in ${time} ms`);

               
                
            });

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }



    });
});
