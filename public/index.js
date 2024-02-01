
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
        const response = await fetch('/download');
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition.split('filename=')[1];
    
        const fileStream = response.body;
        const reader = fileStream.getReader();
    
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob([], { type: 'application/octet-stream' }));
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
    
        const start = performance.now();
        let totalBytes = 0;
    
        const readChunk = async () => {
            const { done, value } = await reader.read();
            if (done) {
                const end = performance.now();
                const timeInSeconds = (end - start) / 1000;
                const downloadSpeedMbps = (totalBytes * 8) / (timeInSeconds * 1024 * 1024);
                console.log(`Download completed. Average speed: ${downloadSpeedMbps.toFixed(2)} Mbps`);
                return;
            }
    
            totalBytes += value.byteLength;
            const blob = new Blob([value]);
            downloadLink.href = window.URL.createObjectURL(blob);
    
            // Continue reading the next chunk
            readChunk();
        };
    
        // Start reading the chunks
        readChunk();
    });
});
