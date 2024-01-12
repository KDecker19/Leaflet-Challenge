const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

// Perform a GET request to the query URL 
d3.json(url).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

// Create a function to set the color of the marker based on the magnitude of the earthquake
const myMap = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

function createFeatures(earthquakeData) {
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });

    earthquakes.addTo(myMap); // Add the earthquakes layer to the map

    earthquakeData.forEach(feature => {
        const { geometry } = feature;
        const { coordinates } = geometry;
        const [longitude, latitude, depth] = coordinates; // Correct extraction

        const marker = L.marker([latitude, longitude], {
            radius: 0,
            fillColor: getColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(myMap);

        marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    });
}

function getColor(depth) {
    if (depth > 90) {
        return '#FF0000';
    }   
    else if (depth > 70) {
        return '#FF4500';
    }
    else if (depth > 50) {
        return '#FF8C00';
    }
    else if (depth > 30) {
        return '#FFA500';
    }
    else if (depth > 10) {
        return '#FFD700';
    }
    else {
        return '#FFFF00';
    }
}

// Create a function to create the popup for each marker
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
}


