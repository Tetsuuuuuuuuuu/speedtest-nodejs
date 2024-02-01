let downloadElement;
let uploadElement;

function generateRandomData(sizeInMB) {
    const totalBytes = sizeInMB * 1024 * 1024;
    const buffer = new ArrayBuffer(totalBytes);
    const uint8Array = new Uint8Array(buffer);
    for (let i = 0; i < totalBytes; i++) {
        uint8Array[i] = Math.floor(Math.random() * 256);
    }
    return new Blob([buffer], { type: 'application/octet-stream' });
}

async function startTestUpload() {
    const dataSizeMB = 10;
    const data = generateRandomData(dataSizeMB);
    const formData = new FormData();
    formData.append('file', data, 'random_data.bin');

    const uploadStart = performance.now();

    uploadElement.classList.remove('measurement-inactive');
    uploadElement.classList.add('measurement-active');

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

            uploadElement.innerHTML = `${uploadSpeedMbps.toFixed(2)} Mbps`;
        } else {
            console.error('Upload failed');
            uploadElement.innerHTML = 'Failed to measure upload speed';
        }
    } catch (error) {
        uploadElement.innerHTML = 'Failed to measure upload speed';
        console.error('Error uploading file:', error);
    }
    finally {
        setTimeout(() => {
            document.getElementById('startMeasure').classList.remove('start-disabled');
            document.getElementById('startMeasure').disabled = false;
        }, 5000);

        uploadElement.classList.remove('measurement-active');
    }
}

document.addEventListener("DOMContentLoaded", async (event) => {
    downloadElement = document.getElementById('download');
    uploadElement = document.getElementById('upload');

    const startMeasureButton = document.getElementById('startMeasure');
    startMeasureButton.addEventListener('click', async () => {
        startMeasureButton.classList.add('start-disabled');
        startMeasureButton.disabled = true;

        downloadElement.classList.remove('measurement-active');
        uploadElement.classList.remove('measurement-active');
        downloadElement.classList.add('measurement-inactive');
        uploadElement.classList.add('measurement-inactive');

        downloadElement.innerHTML = '0.00 Mbps';
        uploadElement.innerHTML = '0.00 Mbps';

        try {
            downloadElement.classList.remove('measurement-inactive');
            downloadElement.classList.add('measurement-active');

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
                    startTestUpload();
                    downloadElement.classList.remove('measurement-active');
                    return;
                }
    
                totalBytes += value.byteLength;
                chunks.push(value);
                readChunk();
                const timeElapsed = (performance.now() - start) / 1000;
                const downloadSpeedMbps = (totalBytes * 8) / (timeElapsed * 1024 * 1024);
                downloadElement.innerHTML = `${downloadSpeedMbps.toFixed(2)} Mbps`;
            };
    
            readChunk();
        } catch (ex) {
            console.error('Error downloading file:', ex);
            downloadElement.innerHTML = 'Failed to measure download speed';
        }
    });
});
