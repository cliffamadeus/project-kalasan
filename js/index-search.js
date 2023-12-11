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
          const resultItem = document.createElement('li');
          resultItem.textContent = `${result.tree_name} in ${result.area_name}`;
          searchResults.appendChild(resultItem);
        });
      }
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });