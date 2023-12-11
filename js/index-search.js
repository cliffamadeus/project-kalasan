// External JSON data for search results
let searchData;

// Fetch and parse the JSON data
fetch('./json/trees.json')
  .then(response => response.json())
  .then(data => {
    searchData = data;

    // Set up event listener after data is loaded
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function () {
      const searchTerm = searchInput.value.toLowerCase();

      // Flatten the tree data for easier searching
      const flatResults = searchData.flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name })));

      const filteredResults = flatResults.filter(result => result.tree_name.toLowerCase().includes(searchTerm));

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

          const treeName = document.createElement('h3');
          treeName.textContent = result.tree_name;

          const areaName = document.createElement('p');
          areaName.textContent = `Found in: ${result.area_name}`;

          const plantedBy = document.createElement('p');
          plantedBy.textContent = `Planted by: ${result.tree_planted_by}`;

          cardContent.appendChild(treeName);
          cardContent.appendChild(areaName);
          cardContent.appendChild(plantedBy);

          cardItem.appendChild(cardContent);

          searchResults.appendChild(cardItem);
        });
      }
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
