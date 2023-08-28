const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markerForm = document.getElementById('marker-form');

const locationList = document.getElementById('location-list');

let pendingMarker = null; // Variable to track the pending marker



map.on('click', (e) => {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  if (pendingMarker) {
    map.removeLayer(pendingMarker);
  }

  // Creating a pending marker and adding it to the map
  pendingMarker = L.marker([lat, lon]).addTo(map);

  // Display the form
  markerForm.style.display = 'block';

  // Form submission logic
  markerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const data = { lat, lng: lon, name, description };

    // Send POST request to server
    fetch('/update-marker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result.message);

      // Bind a popup to the pending marker with the entered name and description
      pendingMarker.bindPopup(`<b>${name}</b><br>${description}`).openPopup();

      // Clear the pending marker
      pendingMarker = null;

      // Hide the form after submission
      markerForm.style.display = 'none';
      markerForm.reset();

      const locationItem = document.createElement('li');
      locationItem.textContent = `Lat: ${lat}, Lng: ${lon}, Name: ${name}, Description: ${description}`;
      locationList.appendChild(locationItem);
    })
    .catch(error => {
      console.error('Error updating marker:', error);
    });
  });
});
