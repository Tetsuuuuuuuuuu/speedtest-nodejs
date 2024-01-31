document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('startMeasure').addEventListener('click', () => {
        const downloadElement = document.getElementById('download');
        const uploadElement = document.getElementById('upload');
      
      const totalTime = 15 * 1000; // Total time in milliseconds
      const interval = 2000; // Interval between tests in milliseconds
      const numTests = Math.ceil(totalTime / interval); // Number of tests to perform
      let downloadSpeedSum = 0;
      let uploadSpeedSum = 0;
      let testsCompleted = 0;

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
            downloadSpeedSum += downloadSpeed;
            testsCompleted++;
            if (testsCompleted === numTests) {
              showResults();
            }
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
            uploadSpeedSum += uploadSpeed;
            testsCompleted++;
            if (testsCompleted === numTests) {
              showResults();
            }
          })
          .catch(error => {
            console.error('Error during upload:', error);
          });
      }

      // Function to show the final results
      function showResults() {
        const avgDownloadSpeed = downloadSpeedSum / numTests;
        const avgUploadSpeed = uploadSpeedSum / numTests;
        downloadElement.innerText = `${avgDownloadSpeed.toFixed(2)} MB/s`;
        uploadElement.innerText = `${avgUploadSpeed.toFixed(2)} MB/s`;
      }

      // Start tests at intervals
      for (let i = 0; i < numTests; i++) {
        setTimeout(() => {
          testDownloadSpeed();
          testUploadSpeed();
        }, i * interval);
      }
    });
  });