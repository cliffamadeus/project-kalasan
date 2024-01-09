// Map setup
const map = L.map('cluster-map').setView([14.350878, 122.299805], 5);
const markers = L.markerClusterGroup();
const currentDate = new Date().toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });

// Tile layer
//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {

  attribution: 'Project Kalasan &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor | custom map by CAFE'
}).addTo(map);

// Reset zoom button event listener
document.getElementById('resetZoomButton').addEventListener('click', function () {
  map.setView([14.350878, 122.299805], 5);
});

// Function to create icon
function createIcon(iconUrl, iconSize, shadowSize, iconAnchor, shadowAnchor, popupAnchor) {
  return L.icon({
    iconUrl,
    iconSize,
    shadowSize,
    iconAnchor,
    shadowAnchor,
    popupAnchor
  });
}

// Icons
const treeIcon = createIcon('./img/tree.png', [40, 40], [40, 40], [20, 40], [2, 40], [0, -40]);
const areaIcon = createIcon('./img/area-icon.png', [50, 50], [40, 40], [30, 50], [3, 50], [0, -50]);

// Fetch and process data
fetch('json/trees.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(area => {
      // Polygon
      const area_name = area.area_name;
      const areaPolygon = L.polygon(area.area_polygon_vertices, { color: 'green' });

      // Popup content
      const popupContent = `
        <div style="padding: 10px;">
          <h3 style="margin-bottom: 5px;">${area_name}</h3>
          <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
          <p style="margin: 10px 0;">This is a beautiful area.</p>
          <a href="#" style="color: blue; text-decoration: none;">Learn More</a>
        </div>
      `;

      // Popup and click event for polygon
      areaPolygon.bindPopup(popupContent);
      areaPolygon.on('click', function (ev) {
        const latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.lat + ', ' + latlng.lng);
      });

      map.addLayer(areaPolygon);

      // Markers
      area.area_trees.forEach(tree => {
        const treeMarker = L.marker(new L.LatLng(tree.tree_lat, tree.tree_long), { icon: treeIcon });

        // Marker popup content
        const markerPopupContent = `
          <div style="z-index: 1001;">
            <p class="text-secondary">Tree ID: ${tree.tree_id}</p>
            <h3 style="margin-bottom: 5px;">${tree.tree_name}</h3>
            <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
            <p style="margin: 10px 0;">Planted by: ${tree.tree_planted_by}</p>
            <p style="margin: 10px 0;">Planted on: ${tree.tree_created_date}</p>
            <a href="#" style="color: blue; text-decoration: none;">View Details</a>
          </div>
        `;

        // Marker and click event
        treeMarker.bindPopup(markerPopupContent);
        markers.addLayer(treeMarker);
        treeMarker.on('click', function (ev) {
          const latlng = map.mouseEventToLatLng(ev.originalEvent);
          console.log(latlng.lat + ', ' + latlng.lng);
        });
      });
    });

    map.addLayer(markers);

  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
