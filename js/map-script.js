var map = L.map('cluster-map').setView([8.011424, 125.279184], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor | custom by CAFE'
}).addTo(map);

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});


var markers = L.markerClusterGroup();

var greenIcon = L.icon({
  iconUrl: './img/leaf-green.png',
  shadowUrl: './img/leaf-shadow.png',
  iconSize:     [38, 95], 
  shadowSize:   [50, 64], 
  iconAnchor:   [22, 94], 
  shadowAnchor: [4, 62],  
  popupAnchor:  [-3, -76]
});

var parkIcon = L.icon({
  iconUrl: './img/park-icon.png',
  iconSize:     [50, 64], 
  shadowSize:   [50, 64], 
  iconAnchor:   [22, 94], 
  shadowAnchor: [4, 62], 
  popupAnchor:  [-3, -76] 
});

fetch('json/trees.json') 
  .then(response => response.json())
  .then(data => {
    data.forEach(park => {
      var title = park.title;
      var parkMarker = L.marker(new L.LatLng(park.lat, park.long), {icon: parkIcon});

      //parkMarker.bindPopup("<h2>" + title + "</h2> <br>");

      parkMarker.bindPopup(`
      <div style="text-align: center; padding: 10px;">
        <h2 style="margin-bottom: 5px;">${title}</h2>
        <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
        <p style="margin: 10px 0;">This is a beautiful park.</p>
        <a href="#" style="color: blue; text-decoration: none;">Learn More</a>
      </div>
      `);

      markers.addLayer(parkMarker);

      parkMarker.on('click', function (ev) {
        var latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.lat + ', ' + latlng.lng);
      });

      // Add markers for trees within the park
      if (park.trees && park.trees.length > 0) {
        park.trees.forEach(tree => {
          var treeMarker = L.marker(new L.LatLng(tree.tree_lat, tree.tree_long),{icon: greenIcon});
          treeMarker.bindPopup("<h3>" + tree.tree_name + "</h3>");

          treeMarker.bindPopup(`
          <div style="text-align: center; padding: 10px;">
            <h2 style="margin-bottom: 5px;">${tree.tree_name}</h2>
            <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
            <p style="margin: 10px 0;">This is a beautiful park.</p>
            <p>Planted by: ${tree.tree_planted_by}</p>
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
