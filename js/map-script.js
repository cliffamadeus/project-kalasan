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

      // Add markers for area_trees within the area
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
  })

  .catch(error => {
    console.error('Error loading JSON:', error);
  });
