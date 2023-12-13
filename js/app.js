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
    const treeParkContainer = document.getElementById('treeParkContainer');
    const totalTreesContainer = document.getElementById('totalTrees');
    let totalTreesPlanted = 0;
  
    data.forEach(area => {
      const areaDiv = document.createElement('div');
      let areaTreesHTML = area.area_trees.map(tree => {
        totalTreesPlanted++;
      }).join('');
  
      areaDiv.innerHTML = `
        <p class="total-trees-planted">${totalTreesPlanted}</p>
        <hr>
        <p class="total-trees-planted-date">Total trees planted as of ${area.area_created_date}</p>
      `;
  
      treeParkContainer.appendChild(areaDiv);
    });
  }
  
  // Fetch and render the tree park data
  fetchData();
  