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

function renderTreePark(data) {
  const totalTreesContainer = document.getElementById('totalTrees');
  let totalAreas = data.length;
  let totalTrees = 0;

  data.forEach(area => {
    totalTrees += area.area_trees.length;
  });

  // Display the total count of areas and trees
  totalTreesContainer.innerHTML = `
  <div class="container" style="text-align:center;">
  <div class="row">
    <div class="col-sm">
      <p>Total Areas</p>
      <h3 class="dashboard-value">${totalAreas}</h3>
    </div>
    <div class="col-sm">
      <p>Total Trees Planted</p>
      <h3 class="dashboard-value">${totalTrees}</h3>
    </div>
  </div>
  </div>
`;
}

// Fetch and render the tree park data
fetchData();
