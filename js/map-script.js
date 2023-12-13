const map = L.map('cluster-map').setView([12.911025, 122.479184], 5);
const markers = L.markerClusterGroup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor | custom by CAFE'
}).addTo(map);

document.getElementById('resetZoomButton').addEventListener('click', function () {
  map.setView([12.911025, 122.479184], 6);
});

function createIcon(iconUrl, iconSize, shadowSize, iconAnchor, shadowAnchor, popupAnchor) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: iconSize,
    shadowSize: shadowSize,
    iconAnchor: iconAnchor,
    shadowAnchor: shadowAnchor,
    popupAnchor: popupAnchor
  });
}

const treeIcon = createIcon('./img/tree.png', [40, 40], [40, 40], [20, 40], [2, 40], [0, -40]);

const areaIcon = createIcon('./img/area-icon.png', [50, 50], [40, 40], [30, 50], [3, 50], [0, -50]);

fetch('json/trees.json') 
  .then(response => response.json())
  .then(data => {
    data.forEach(area => {

    //Polygon
    const area_name = area.area_name;
    const areaPolygon = L.polygon(area.area_polygon_vertices, { color: 'green' });

    areaPolygon.bindPopup(`
      <div style="padding: 10px;">
        <h3 style="margin-bottom: 5px;">${area_name}</h3>
        <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
        <p style="margin: 10px 0;">This is a beautiful area.</p>
        <a href="#" style="color: blue; text-decoration: none;">Learn More</a>
      </div>
    `);

    areaPolygon.on('click', function (ev) {
      const latlng = map.mouseEventToLatLng(ev.originalEvent);
      console.log(latlng.lat + ', ' + latlng.lng);
    });

    map.addLayer(areaPolygon);

    //Markers
      area.area_trees.forEach(tree => {
        const treeMarker = L.marker(new L.LatLng(tree.tree_lat, tree.tree_long),{icon: treeIcon});

        treeMarker.bindPopup(`
          <div padding: 10px;">
          <p style="margin: 10px 0;"class="text-secondary">Tree ID: ${tree.tree_id}</p>
          <h3 style="margin-bottom: 5px;">${tree.tree_name}</h3>
          <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
          <p style="margin: 10px 0;">Planted by: ${tree.tree_planted_by}</p>
          <p style="margin: 10px 0;">Planted on: ${tree.tree_created_date}</p>
          <a href="#" style="color: blue; text-decoration: none;">View Details</a>
          </div>
        `);

        markers.addLayer(treeMarker);

        treeMarker.on('click', function (ev) {
          const latlng = map.mouseEventToLatLng(ev.originalEvent);
              console.log(latlng.lat + ', ' + latlng.lng);
        });


        
      });
    });
    map.addLayer(markers);

    
    //Preload
    
    const recentRecordsContainer = document.getElementById('recentRecordsContainer');
    recentRecordsContainer.innerHTML = generateHTMLContent(data);

      function generateHTMLContent(data) {
        return data.map(area => {
          const areaHTML = `
            <div >
                ${area.area_trees.slice(0, 3).map(tree => 
                  `
                  <div class="map-preload-item">
                  <span style="display: inline-block;">
                    <a href="${tree.tree_id.trim()}" class="map-recent-records-header">${tree.tree_id.trim()}</a>
                    ${tree.tree_planted_by} has recently planted a tree
                    <br>Area: ${area.area_name} 
                  </span>
                  </div>
                  <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
                `)
                .join('')}
            </div>
          `;
          return areaHTML;
        }).join('');
      }
    //Search
      searchData = data;
      const searchInputBar = document.getElementById('searchInputBar');
      const searchResults = document.getElementById('searchResults');
      
      const noResultsItem = document.createElement('li');
      noResultsItem.innerHTML = '<h5 style="color: grey; text-align: center;">No results found</h5>';
      
      searchInputBar.addEventListener('input', function () {
          const searchTerm = searchInputBar.value.toLowerCase();
      
          if (!searchTerm) {
              searchResults.innerHTML = '';
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
      
              Object.entries(areaTreeCountMap).forEach(([areaName, treeCount]) => {
                  const searchCardItem = document.createElement('li');
                  searchCardItem.innerHTML = `
                      <div class="map-search-item" style="padding:5px;">
                          <h5>${areaName} (${treeCount} trees)</h5>
                          <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
                      </div>
                  `;
      
                  searchResults.appendChild(searchCardItem);
      
                  searchCardItem.addEventListener('click', function () {
                      const selectedArea = searchData.find(area => area.area_name === areaName);
      
                      // Use the centroid or any other method to get the center of the area
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
