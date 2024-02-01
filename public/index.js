document.addEventListener("DOMContentLoaded", async (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    document.getElementById('startMeasure').addEventListener('click', async () => {
        const response = await fetch('/download');
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition.split('filename=')[1];

        const start = performance.now();
        let totalBytes = 0;

        const chunks = [];
        
        const reader = response.body.getReader();

        const readChunk = async () => {
            const { done, value } = await reader.read();
            if (done) {
                const end = performance.now();
                const timeInSeconds = (end - start) / 1000;
                const downloadSpeedMbps = (totalBytes * 8) / (timeInSeconds * 1024 * 1024);
                
                downloadElement.innerHTML = `${downloadSpeedMbps.toFixed(2)} Mbps`;

                // Combine all chunks into a single blob
                const blob = new Blob(chunks);
                
                // Create a download link and simulate click to download the file
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = filename;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                return;
            }

            totalBytes += value.byteLength;
            chunks.push(value);

            // Continue reading the next chunk
            readChunk();

            // show current download speed
            const timeElapsed = (performance.now() - start) / 1000;
            const downloadSpeedMbps = (totalBytes * 8) / (timeElapsed * 1024 * 1024);
            downloadElement.innerHTML = `${downloadSpeedMbps.toFixed(2)} Mbps`;
        };

        // Start reading the chunks
        readChunk();
    });
});
