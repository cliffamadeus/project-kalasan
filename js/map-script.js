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

    // Recent Records
    const recentRecordsContainer = document.getElementById('recentRecordsContainer');
    recentRecordsContainer.innerHTML = generateHTMLContent(data);

    function generateHTMLContent(data) {
      // Flatten the array of trees across all areas
      const allTrees = data.flatMap(area => area.area_trees);
    
      // Sort the flattened array in descending order based on tree_id
      const sortedTrees = allTrees
        .sort((a, b) => parseInt(b.tree_id, 10) - parseInt(a.tree_id, 10))
        .slice(0, 5); // Take the top 5 trees
    
      // Find the default area name (using the first area in the data)
      const defaultAreaName = data.length > 0 ? data[0].area_name : 'Unknown Area';
    
      // Generate HTML content
      const htmlContent = `
        <div>
          ${sortedTrees.map(tree => 
            `
            <div class="map-preload-item" onclick="flyToLocation(${tree.tree_lat}, ${tree.tree_lng})">
              <span style="display: inline-block;">
                <a href="${tree.tree_id.trim()}" class="map-recent-records-item">Tree #${tree.tree_id.trim()}</a>
                ${tree.tree_planted_by} has recently planted a tree
                <br>Area: ${tree.area_name || defaultAreaName} 
              </span>
            </div>
            <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
            `)
            .join('')}
        </div>
      `;
    
      return htmlContent;
    }

    // Search
    searchData = data;
    const searchInputBar = document.getElementById('searchInputBar');
    const searchResults = document.getElementById('searchResults');
    const noResultsItem = document.createElement('div');
    noResultsItem.innerHTML = '<h5 style="color: grey; text-align: center;">No results found</h5>';

    performSearch('');

    function performSearch(searchTerm) {
      const flatResults = searchData.flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name })));
      const filteredResults = flatResults.filter(result => result.tree_name.toLowerCase().includes(searchTerm));

      displaySearchResults(filteredResults);
    }

    searchInputBar.addEventListener('input', function () {
      const searchTerm = searchInputBar.value.toLowerCase();

      if (!searchTerm) {
        searchResults.innerHTML = '';
        performSearch('');
        return;
      }

      const filteredResults = searchData
        .flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name, tree_planted_by: tree.tree_planted_by })))
        .filter(result => result.area_name.toLowerCase().includes(searchTerm) || result.tree_name.toLowerCase().includes(searchTerm) || result.tree_planted_by.toLowerCase().includes(searchTerm));

      displaySearchResults(filteredResults);
    });

    function displaySearchResults(results) {
      searchResults.innerHTML = '';

      if (results.length === 0) {
        searchResults.appendChild(noResultsItem);
      } else {
        const areaTreeCountMap = {};
        results.forEach(result => {
          const areaName = result.area_name;
          areaTreeCountMap[areaName] = (areaTreeCountMap[areaName] || 0) + 1;
        });

        //Search Objects Rendered form JSON
        Object.entries(areaTreeCountMap).forEach(([areaName, treeCount]) => {
          const searchCardItem = document.createElement('div');
          searchCardItem.innerHTML = `
            <div class="map-search-item" style="padding:5px;">
              <div class="row">
                <div class="col-sm-4">
                  <img src="./img/tree.png" class="img-thumbnail"></img>
                </div>
                <div class="col-sm-8">
                  <h5>Barangay ${areaName}</h5>
                  <p> (${treeCount}) tree record/s found as of ${currentDate}</p>
                  <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
                </div>
              </div>         
            </div>
          `;

          searchResults.appendChild(searchCardItem);
          searchCardItem.addEventListener('click', function () {
            const selectedArea = searchData.find(area => area.area_name === areaName);
            const areaCenter = [selectedArea.area_lat, selectedArea.area_lng];
            map.flyTo(areaCenter, 17, { duration: 0.25 });
          });
        });
      }
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
