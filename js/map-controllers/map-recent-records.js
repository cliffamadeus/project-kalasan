// recent-records.js

function generateHTMLContent(data) {
    // Flatten the array of trees across all areas
    const allTrees = data.flatMap(area => area.area_trees);
  
    // Sort the flattened array in descending order based on tree_id
    const sortedTrees = allTrees
      .sort((a, b) => parseInt(b.tree_id, 10) - parseInt(a.tree_id, 10))
      .slice(0, 5); // Take the top 5 trees
  
    // Find the default area name (using the first area in the data)
    const defaultAreaName = data.length > 0 ? data[0].area_name : 'Unknown Area';
  
    // Generate HTML content
    const htmlContent = `
      <div>
        ${sortedTrees.map(tree => 
          `
          <div class="map-preload-item" onclick="flyToLocation(${tree.tree_lat}, ${tree.tree_lng})">
            <span style="display: inline-block;">
              <a href="${tree.tree_id.trim()}" class="map-recent-records-item">Tree #${tree.tree_id.trim()}</a>
              ${tree.tree_planted_by} has recently planted a tree
              <br>Area: ${tree.area_name || defaultAreaName} 
            </span>
          </div>
          <hr style="border-top: 1px solid #ccc; margin: 5px 0;">
          `)
          .join('')}
      </div>
    `;
  
    return htmlContent;
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    // Fetch and process data
    fetch('json/trees.json')
      .then(response => response.json())
      .then(data => {
        // Recent Records
        const recentRecordsContainer = document.getElementById('recentRecordsContainer');
        recentRecordsContainer.innerHTML = generateHTMLContent(data);
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
      });
  });
  