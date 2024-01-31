


document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('startMeasure').addEventListener('click', () => {
        // Function to test download speed
        function testDownloadSpeed() {
            const startTime = performance.now();
  
            fetch('/download')
              .then(response => response.blob())
              .then(blob => {
                const endTime = performance.now();
                const downloadTime = (endTime - startTime) / 1000; // Convert to seconds
                const fileSizeMB = blob.size / (1024 * 1024); // Convert to MB
                const downloadSpeed = fileSizeMB / downloadTime; // MB/s
                console.log(`Download Speed: ${downloadSpeed.toFixed(2)} MB/s`);
              })
              .catch(error => {
                console.error('Error during download:', error);
              });
          }
  
          // Function to test upload speed
          function testUploadSpeed() {
            const uploadSizeMB = 5; // Size of the test data to upload in MB
            const formData = new FormData();
            const dummyData = new ArrayBuffer(uploadSizeMB * 1024 * 1024);
            formData.append('data', new Blob([dummyData]));
  
            const startTime = performance.now();
  
            fetch('/upload', {
              method: 'POST',
              body: formData
            })
              .then(response => {
                const endTime = performance.now();
                const uploadTime = (endTime - startTime) / 1000; // Convert to seconds
                const uploadSpeed = uploadSizeMB / uploadTime; // MB/s
                console.log(`Upload Speed: ${uploadSpeed.toFixed(2)} MB/s`);
              })
              .catch(error => {
                console.error('Error during upload:', error);
              });
          }
  
          // Start tests
          testDownloadSpeed();
          testUploadSpeed();
    });
});
