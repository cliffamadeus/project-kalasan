var map = L.map('cluster-map').setView([8.011424, 125.279184], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor | custom by CAFE'
}).addTo(map);

var markers = L.markerClusterGroup();

var treeIcon = L.icon({
  iconUrl: './img/tree.png',
  iconSize:     [40, 40], 
  shadowSize:   [40, 40], 
  iconAnchor:   [20, 40], 
  shadowAnchor: [2, 40], 
  popupAnchor:  [0, -40]  
});

var areaIcon = L.icon({
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
      var area_name = area.area_name;
      var areaMarker = L.marker(new L.LatLng(area.area_lat, area.area_lng), {icon: areaIcon});

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
        var latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.area_lat + ', ' + latlng.area_lng);
      });

      if (area.area_trees && area.area_trees.length > 0) {
        area.area_trees.forEach(tree => {
          var treeMarker = L.marker(new L.LatLng(tree.tree_lat, tree.tree_long),{icon: treeIcon});
         
          treeMarker.bindPopup(`
          <div padding: 10px;">
            <h3 style="margin-bottom: 5px;">${tree.tree_name}</h3>
            <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
            <p style="margin: 10px 0;">Planted by: ${tree.tree_planted_by}</p>
            <p style="margin: 10px 0;">Planted on: ${tree.tree_created_date}</p>
          </div>
          `);

          markers.addLayer(treeMarker);

          treeMarker.on('click', function (ev) {
            var latlng = map.mouseEventToLatLng(ev.originalEvent);
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
  
      searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
  
        const filteredResults = searchData
        .flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name, tree_planted_by: tree.tree_planted_by })))
        .filter(result => result.tree_name.toLowerCase().includes(searchTerm) || result.tree_planted_by.toLowerCase().includes(searchTerm));
      
        displaySearchResults(filteredResults);
      
      });
  
      function displaySearchResults(results) {
        searchResults.innerHTML = '';
  
        if (results.length === 0) {
          const noResultsItem = document.createElement('li');
          noResultsItem.textContent = 'No results found';
          searchResults.appendChild(noResultsItem);
        } else {
          results.forEach(result => {
            const cardItem = document.createElement('li');
            cardItem.classList.add('search-card');
  
            const cardContent = document.createElement('div');
            cardContent.classList.add('search-card-content');
  
            const treeName = document.createElement('h5');
            treeName.textContent = result.tree_name;
  
            const areaName = document.createElement('p');
            areaName.textContent = `Found in : ${result.area_name}`;
  
            const plantedBy = document.createElement('p');
            plantedBy.textContent = `Planted by : ${result.tree_planted_by}`;

            const plantedOn = document.createElement('p');
            plantedOn.textContent = `${result.tree_created_date}`;

            cardContent.appendChild(plantedBy);
            cardContent.appendChild(treeName);
            cardContent.appendChild(areaName);
            cardContent.appendChild(plantedOn);
            
            cardItem.appendChild(cardContent);
  
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
