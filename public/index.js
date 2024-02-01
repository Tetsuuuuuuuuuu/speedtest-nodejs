var downloadElement;
var uploadElement;

function generateRandomData(sizeInMB) {
    const totalBytes = sizeInMB * 1024 * 1024;
    const buffer = new ArrayBuffer(totalBytes);
    const uint8Array = new Uint8Array(buffer);
    for (let i = 0; i < totalBytes; i++) {
        uint8Array[i] = Math.floor(Math.random() * 256);
    }
    return new Blob([buffer], { type: 'application/octet-stream' });
}

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

        // Wait for all the chunks to be read
        await Promise.all(chunks);

        const dataSizeMB = 10; // Size of data to generate in megabytes
        const data = generateRandomData(dataSizeMB);
        const formData = new FormData();
        formData.append('file', data, 'random_data.bin');

        const uploadStart = performance.now();

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const end = performance.now();
                const timeInSeconds = (end - uploadStart) / 1000;
                const uploadSpeedMbps = (dataSizeMB * 8) / timeInSeconds;
                
                console.log('File uploaded successfully');
                console.log(`Upload speed: ${uploadSpeedMbps.toFixed(2)} Mbps`);
                // Handle success
            } else {
                console.error('Upload failed');
                // Handle failure
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error
        }
    });
});
