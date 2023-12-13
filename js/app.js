 // Function to fetch external data
 async function fetchData() {
    try {
      const response = await fetch('./json/trees.json'); // Replace with your API endpoint
      const data = await response.json();
      renderTreePark(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Function to render tree data
  function renderTreePark(data) {
    const treeParkContainer = document.getElementById('treeParkContainer');

    data.forEach(area => {
      const areaDiv = document.createElement('div');
      areaDiv.innerHTML = `
        <h2>${area.area_name}</h2>
        <p>Created Date: ${area.area_created_date}</p>
        <p>Modified Date: ${area.area_modified_date}</p>
        <ul>
          ${area.area_trees.map(tree => `
            <li>
              <strong>${tree.tree_name}</strong>
              <br>Tree ID: ${tree.tree_id}
              <br>Planted by: ${tree.tree_planted_by}
              <br>Coordinates: (${tree.tree_lat}, ${tree.tree_long})
              <br>Created Date: ${tree.tree_created_date}
            </li>
          `).join('')}
        </ul>
        <hr>
      `;

      treeParkContainer.appendChild(areaDiv);
    });
  }

  // Fetch and render the tree park data
  fetchData();