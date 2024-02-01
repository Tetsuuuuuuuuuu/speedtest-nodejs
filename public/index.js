var downloadElement;
var uploadElement;

const totalTime = 15 * 1000; // Total time in milliseconds
const interval = 2000; // Interval between tests in milliseconds
const numTestsPerPhase = 10; // Number of tests per phase
let downloadSpeedSum = 0;
let uploadSpeedSum = 0;
let testsCompleted = 0;
let phase = 'download'; // Current phase ('download' or 'upload')

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
      if (testsCompleted < numTestsPerPhase) {
        setTimeout(startNextTest, interval);
      } else {
        if (phase === 'download') {
          phase = 'upload';
          testsCompleted = 0;
          startNextTest();
        } else {
          showResults();
        }
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
    .then(response => response.text())
    .then(() => {
      const endTime = performance.now();
      const uploadTime = (endTime - startTime) / 1000; // Convert to seconds
      const uploadSpeed = uploadSizeMB / uploadTime; // MB/s
      uploadSpeedSum += uploadSpeed;
      testsCompleted++;
      if (testsCompleted < numTestsPerPhase) {
        setTimeout(startNextTest, interval);
      } else {
        showResults();
      }
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
}

// Function to start next test
function startNextTest() {
  if (phase === 'download') {
    testDownloadSpeed();
  } else {
    testUploadSpeed();
  }
}

// Function to show the final results
function showResults() {
  const avgDownloadSpeed = downloadSpeedSum / numTestsPerPhase;
  const avgUploadSpeed = uploadSpeedSum / numTestsPerPhase;
  downloadElement.innerText = `${avgDownloadSpeed.toFixed(2)} MB/s`;
  uploadElement.innerText = `${avgUploadSpeed.toFixed(2)} MB/s`;
}

document.addEventListener("DOMContentLoaded", (event) => {
  downloadElement = document.getElementById('download');
  uploadElement = document.getElementById('upload');

  document.getElementById('startMeasure').addEventListener('click', () => {
    // Reset variables
    downloadSpeedSum = 0;
    uploadSpeedSum = 0;
    testsCompleted = 0;
    phase = 'download';
    startNextTest();
  });
});
