const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// stores marker details in an empty object
const markers = {};

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route to update marker details
app.post('/update-marker', (req, res) => {
  const { lat, lng, name, description } = req.body;
  const markerId = `marker_${lat}_${lng}`;
  markers[markerId] = { lat, lng, name, description };
  console.log(`New Marker: Lat=${lat}, Lng=${lng}, Name=${name}, Description=${description}`);
  res.json({ message: 'Marker details updated successfully' });
});

//  index.html file route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
