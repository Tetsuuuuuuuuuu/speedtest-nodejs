function measureSpeed(url, size, durationSeconds, type) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.responseType = 'blob';
        let startTime = 0;
        let bytesTransferred = 0;

        xhr.upload.onprogress = function(event) {
            if (startTime === 0) {
                startTime = performance.now();
            }
            bytesTransferred += event.loaded;

            const currentTime = performance.now();
            const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds

            console.log(`${type} speed: ${bytesTransferred / elapsedTime / (1024 * 1024)} Mbps`);

            if (elapsedTime >= durationSeconds) {
                xhr.abort(); // Stop the request if duration exceeded
                const speed = (bytesTransferred / elapsedTime / (1024 * 1024)).toFixed(2); // Calculate speed in Mbps
                resolve(speed);
            } else {
                const speed = (bytesTransferred / elapsedTime / (1024 * 1024)).toFixed(2); // Calculate speed in Mbps
                console.log(`${type} speed!: ${speed} Mbps`);
                document.getElementById(type).innerText = `${speed} Mbps`;
            }
        };

        xhr.onload = function() {
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
            const speed = (size / elapsedTime / (1024 * 1024)).toFixed(2); // Calculate speed in Mbps
            resolve(speed);
        };

        xhr.onerror = function() {
            reject(new Error(`Failed to ${type} file (status ${xhr.status})`));
        };

        const formData = new FormData();
        formData.append('file', new Blob([new Uint8Array(size)]));
        xhr.send(formData);
    });
}

const uploadUrl = 'https://speedtest.peer2.live/upload'; // URL of the server
const downloadUrl = 'https://speedtest.peer2.live/download'; // URL of the server
const fileSize = 1024 * 1024; // Size of the file in bytes (1 MB)
const durationSeconds = 15000; // Duration of the test in seconds

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("startMeasure").addEventListener("click", function(ev) {
        Promise.all([
            measureSpeed(uploadUrl, fileSize, durationSeconds, 'upload'),
            measureSpeed(downloadUrl, fileSize, durationSeconds, 'download')
        ]).then(([uploadSpeed, downloadSpeed]) => {
            console.log(`Upload speed: ${uploadSpeed} Mbps`);
            document.getElementById('upload').innerText = `${uploadSpeed} Mbps`;
            console.log(`Download speed: ${downloadSpeed} Mbps`);
            document.getElementById('download').innerText = `${downloadSpeed} Mbps`;
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});
