const cameraFeed = document.getElementById('cameraFeed');
const arrowCanvas = document.getElementById('arrowCanvas');
const ctx = arrowCanvas.getContext('2d');
const locationSelect = document.getElementById('locationSelect');
const startNavButton = document.getElementById('startNavButton');
const addStopButton = document.getElementById('addStopButton');

// Fetch existing stops from the server and populate the dropdown
async function loadStops() {
    const response = await fetch('/stops');
    const stops = await response.json();
    locationSelect.innerHTML = '';
    stops.forEach(stop => {
        const option = document.createElement('option');
        option.value = stop.id;
        option.textContent = stop.name;
        locationSelect.appendChild(option);
    });
}

// Access the camera feed
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera: ', err);
    }
}

// Draw arrow on the canvas to indicate direction
function drawArrow() {
    ctx.clearRect(0, 0, arrowCanvas.width, arrowCanvas.height);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(arrowCanvas.width / 2, arrowCanvas.height / 4);
    ctx.lineTo(arrowCanvas.width / 2 - 20, arrowCanvas.height / 2);
    ctx.lineTo(arrowCanvas.width / 2 + 20, arrowCanvas.height / 2);
    ctx.closePath();
    ctx.fill();
}

// Add stop button functionality
addStopButton.addEventListener('click', async () => {
    const stopName = prompt("Enter the name of this location:");
    if (stopName) {
        const response = await fetch('/addStop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: stopName })
        });
        if (response.ok) {
            loadStops();
        }
    }
});

// Start navigation button functionality
startNavButton.addEventListener('click', () => {
    drawArrow();  // This would be dynamically updated in a real app
});

window.onload = () => {
    startCamera();
    loadStops();
};
