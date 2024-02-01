
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
            }).then((response) => {
                let reader = response.body.getReader();

                return new ReadableStream({
                    start(controller) {
                        return pump();

                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }

                                totalMebiDownloaded += value.length / 1024 / 1024;
                                showDownloadSpeed(totalMebiDownloaded / ((new Date().getTime() - start) / 1000));

                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    }
                });
            }).then((stream) => {
                return new Response(stream, { headers: { "Content-Type": "application/octet-stream" } }).arrayBuffer();
            }).then((buffer) => {
                totalTime += new Date().getTime() - start;
            });
            

            

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }



    });
});
