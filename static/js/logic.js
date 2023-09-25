// Initialize the map
var map = L.map('map').setView([53, -140.0], 4); // United States view with zoom level 4

// Add a tile layer from OpenStreetMap or any other tile provider
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data from the USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through the earthquake data and add markers to the map
        data.features.forEach(function (quake) {
            var coords = quake.geometry.coordinates; // Get earthquake coordinates
            var magnitude = quake.properties.mag; // Get earthquake magnitude
            var depth = quake.geometry.coordinates[2]; // Get earthquake depth
        
            // Create a circle at the earthquake coordinates
            var circle = L.circle([coords[1], coords[0]], {
                radius: magnitude * 10000,
                color: getColor(depth),
                weight: 1.5,
                fillColor: getColor(depth),
                fillOpacity: 0.7
            })
            .addTo(map)
            .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth);
        
            // Add a tooltip with the earthquake information
            circle.bindTooltip('Coordinates: ' + coords[1] + ', ' + coords[0] + '<br>Depth: ' + depth + '<br>Magnitude: ' + magnitude, {
                direction: 'top', // Adjust the tooltip placement as needed
                permanent: false, // Set to true if you want the tooltip to be always visible
                opacity: 0.9 // Adjust the opacity of the tooltip
            });
        });
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
});



// Create an array of depth ranges and corresponding colors
var depthRanges = [
    { min: -10, max: 0, color: '#FFD700' },
    { min: 0, max: 25, color: '#FFA500' },
    { min: 25, max: 50, color: '#FF6347' },
    { min: 50, max: 100, color: '#8B0000' },
    { min: 100, max: '', color: '#800000'}
];

// Add the legend items dynamically
var legend = document.getElementById('legend');

depthRanges.forEach(function (range) {
    var legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.style.backgroundColor = range.color;
    legend.appendChild(legendItem);

    var label = document.createElement('span');
    label.textContent = range.min + ' - ' + range.max;
    label.style.color = 'white'; // Set the text color to white
    legendItem.appendChild(label);
});



// ... Your existing code for fetching earthquake data and creating circles on the map

// Loop through the earthquake data and add markers to the map
data.features.forEach(function (quake) {
    var coords = quake.geometry.coordinates; // Get earthquake coordinates
    var magnitude = quake.properties.mag; // Get earthquake magnitude
    var depth = quake.geometry.coordinates[2]; // Get earthquake depth

    // Create a circle at the earthquake coordinates
    var circle = L.circle([coords[1], coords[0]], {
        radius: magnitude * 10000,
        color: getColor(depth),
        weight: 1.5,
        fillColor: getColor(depth),
        fillOpacity: 0.7
    })
    .addTo(map)
    .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth);

    // Add a tooltip with the earthquake information
    circle.bindTooltip('Coordinates: ' + coords[1] + ', ' + coords[0] + '<br>Depth: ' + depth + '<br>Magnitude: ' + magnitude, {
        direction: 'top', // Adjust the tooltip placement as needed
        permanent: false, // Set to true if you want the tooltip to be always visible
        opacity: 0.9 // Adjust the opacity of the tooltip
    });
});




function getColor(depth) {
    var color = d3.scaleSequential()
        .interpolator(d3.interpolateRgb("gold", "darkred")) // Reverse the colors
        .domain([-10, 100]);
    return color(depth);
}


