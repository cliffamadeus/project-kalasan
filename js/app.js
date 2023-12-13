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
    <p>Total areas: ${totalAreas}</p>
    <p>Total trees: ${totalTrees}</p>
  `;
}

// Fetch and render the tree park data
fetchData();
