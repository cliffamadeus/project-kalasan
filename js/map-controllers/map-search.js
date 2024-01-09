document.addEventListener('DOMContentLoaded', function () {
    // Fetch and process data
    fetch('json/trees.json')
      .then(response => response.json())
      .then(data => {
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

  });