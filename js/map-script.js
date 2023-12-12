const map = L.map('cluster-map').setView([12.911025, 122.479184], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor | custom by CAFE'
}).addTo(map);

const markers = L.markerClusterGroup();

const treeIcon = L.icon({
  iconUrl: './img/tree.png',
  iconSize:     [40, 40], 
  shadowSize:   [40, 40], 
  iconAnchor:   [20, 40], 
  shadowAnchor: [2, 40], 
  popupAnchor:  [0, -40]  
});

const areaIcon = L.icon({
  iconUrl: './img/area-icon.png',
  iconSize:     [50, 50], 
  shadowSize:   [40, 40], 
  iconAnchor:   [30, 50], 
  shadowAnchor: [3, 50], 
  popupAnchor:  [0, -50]  
});
 
fetch('json/trees.json') 
  .then(response => response.json())
  .then(data => {
    data.forEach(area => {
      const area_name = area.area_name;
      const areaMarker = L.marker(new L.LatLng(area.area_lat, area.area_lng), {icon: areaIcon});

      areaMarker.bindPopup(`
      <div padding: 10px;">
        <h3 style="margin-bottom: 5px;">${area_name}</h3>
        <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
        <p style="margin: 10px 0;">This is a beautiful area.</p>
        <a href="#" style="color: blue; text-decoration: none;">Learn More</a>
      </div>
      `);

      markers.addLayer(areaMarker);

      areaMarker.on('click', function (ev) {
        const latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.area_lat + ', ' + latlng.area_lng);
      });

      if (area.area_trees && area.area_trees.length > 0) {
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
      }
      });

      map.addLayer(markers);

      searchData = data;

      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('searchResults');
      /*
      performSearch('');
  
      function performSearch(searchTerm) {
  
        const flatResults = searchData.flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name })));
  
        const filteredResults = flatResults.filter(result => result.tree_name.toLowerCase().includes(searchTerm));
  
        displaySearchResults(filteredResults);
      }*/
      const noResultsItem = document.createElement('li');
      noResultsItem.textContent = 'No results found';
      searchResults.appendChild(noResultsItem);

      searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();

        if (!searchTerm) {
          searchResults.innerHTML = '';
          searchResults.appendChild(noResultsItem);
          return;
        }

        const filteredResults = searchData
        .flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name, tree_planted_by: tree.tree_planted_by })))
        .filter(result => result.tree_name.toLowerCase().includes(searchTerm) || result.tree_planted_by.toLowerCase().includes(searchTerm));
      
        displaySearchResults(filteredResults);
      
      });
  
      function displaySearchResults(results) {

        searchResults.innerHTML = '';
  
        if (results.length === 0) {

          searchResults.appendChild(noResultsItem);
          
        } else {

          results.forEach(result => {
            const cardItem = document.createElement('li');        
            cardItem.innerHTML = `
              <div style="padding:5px;">
                <h5>${result.tree_name}</h5>
                <p>Found in: ${result.area_name}</p>
                <p>Planted by: ${result.tree_planted_by}</p>
                <p>${result.tree_created_date}</p>
                <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
              </div>
            `;
  
            searchResults.appendChild(cardItem);
  
            cardItem.addEventListener('click', function () {
              const selectedTree = searchData.find(area => area.area_name === result.area_name)
                .area_trees.find(tree => tree.tree_name === result.tree_name);
  
              map.flyTo([selectedTree.tree_lat, selectedTree.tree_long], 17,{ duration: .25 });
            });
          });
         
        }
      }
  })

  .catch(error => {
    console.error('Error loading JSON:', error);
  });
