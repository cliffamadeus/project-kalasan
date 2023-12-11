let searchData;

fetch('./json/trees.json')
  .then(response => response.json())
  .then(data => {
    searchData = data;

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    performSearch('');

    function performSearch(searchTerm) {

      const flatResults = searchData.flatMap(area => area.area_trees.map(tree => ({ ...tree, area_name: area.area_name })));

      const filteredResults = flatResults.filter(result => result.tree_name.toLowerCase().includes(searchTerm));

      displaySearchResults(filteredResults);
    }

    searchInput.addEventListener('input', function () {
      const searchTerm = searchInput.value.toLowerCase();

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

          const treeName = document.createElement('h5');
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
