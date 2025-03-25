     //show brands of mobiles, laptops   
       document.addEventListener("DOMContentLoaded", function() {
    let lastOpenedSection = null; // Store the last opened section

    function showSection(id) {
        // Hide the previously opened section if it exists
        if (lastOpenedSection && lastOpenedSection !== id) {
            document.getElementById(lastOpenedSection).style.display = "none";
        }

        let targetElement = document.getElementById(id);
        if (targetElement) {
            // Toggle visibility
            if (targetElement.style.display === "grid") {
                targetElement.style.display = "none";
                lastOpenedSection = null;
            } else {
                targetElement.style.display = "grid";
                lastOpenedSection = id;
            }
        }
    }
    document.querySelectorAll(".cardx").forEach(card => {
        card.addEventListener("click", function() {
            let targetId = this.getAttribute("data-target");
            if (targetId) {
                showSection(targetId);
            }
        });
    });
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   document.addEventListener("DOMContentLoaded", function () {
    // Get all sections with an ID
    document.querySelectorAll("[id]").forEach(section => {
        let sectionId = section.id; // Get section ID
        let fetchUrl = `https://nearbysx.pages.dev/${sectionId}.html`; // Construct the fetch URL

        // Fetch content and load it inside the section
        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${sectionId}`);
                }
                return response.text();
            })
            .then(data => {
                section.innerHTML = data; // Inject fetched HTML
            })
            .catch(error => {
                console.error("Error fetching content:", error);
            });
    });
});

//xxxxxxxxxxxxxxxxxxxxxxxx

function closePopup() {
    document.getElementById("storesPopup").style.display = "none";
}

function showNoItemPopup() {
  const noItemPopup = document.getElementById("noItemPopup");
  selectNoItemPopup.style.display = "block";
  setTimeout(() => {
    selectNoItemPopup.style.display = "none";
  }, 2000);
}
        
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function showStores(category) {

        fetch(categoryUrls[category])
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, "text/html");
                let stores = [];

                doc.querySelectorAll(".stores-card").forEach(card => {
                    let img = card.querySelector("img")?.src;
                    let name = card.querySelector("p")?.textContent;
                    if (img && name) stores.push({ name, image: img });
                });

                let storesList = `<div class="stores-grid">`;
                stores.forEach(stores => {
                    storesList += `
                        <div class="stores-card" onclick="searchStores('${stores.name}')">
                            <img src="${stores.image}" alt="${stores.name}" loading="lazy">
                            <p>${stores.name}</p>
                        </div>
                    `;
                });
                storesList += `</div>`;
                document.getElementById("storesList").innerHTML = storesList;
                document.getElementById("storesPopup").style.display = "block";
            })
            .catch(error => {
                console.error("Error loading items:", error);
                document.getElementById("errorPopup").style.display = "block";
            });
    }
  
  function closeErrorPopup() {
    document.getElementById("errorPopup").style.display = "none";
}  

<!-- xxxxxxxxxxxxxxxxxxxxxx --> 

function searchStores(stores) {
  let userLocation = getActiveLocation();
  
  if (!userLocation) {
    showSelectLocationPopup();
    return;
  }
  
  // Define reference coordinates from user's active location
  const refLat = userLocation.lat;
  const refLng = userLocation.lon;

  let nearbyVendors = [];
  let selectedCategory = stores; // The selected category is passed as the 'stores' parameter

  const radii = [1, 2, 3, 4, 5];
  
  // Loop through increasing radii until matches are found
  for (let i = 0; i < radii.length && nearbyVendors.length === 0; i++) {
    const radius = radii[i];
    nearbyVendors = [];
    
    for (let vendor in vendors) {
      const vendorData = vendors[vendor];
      const distance = getDistance(refLat, refLng, vendorData.lat, vendorData.lng);
      
      if (distance <= radius && vendorData.categories.includes(selectedCategory)) {
        nearbyVendors.push(vendor);
      }
    }
  }
  
  if (nearbyVendors.length > 0) {
    window.location.href = `https://order-app-ae.myshopify.com/pages/stores?collections=${nearbyVendors.join(",")}`;
  } else {
    document.getElementById("noItemPopup").style.display = "block";
  }
}

//xxxxxxxxxxxxxxxxxxxxxxxx

unction searchItem(item) {
  let userLocation = getActiveLocation();

  if (!userLocation) {
    showSelectLocationPopup();
    return;
  }

  // Get the alt value from the clicked item's image
  let clickedItem = event.currentTarget.querySelector("img");
  if (clickedItem) {
    item = clickedItem.getAttribute("alt");
  }

  const radii = [1, 2, 3, 4, 5];
  let nearbyVendors = [];

  // Loop through radii until vendors are found or maximum radius reached
  for (let i = 0; i < radii.length && nearbyVendors.length === 0; i++) {
    const radius = radii[i];
    nearbyVendors = []; // reset for this radius

    for (const vendor in vendors) {
      let distance = getDistance(
        userLocation.lat, userLocation.lon,
        vendors[vendor].lat, vendors[vendor].lng
      );
      if (distance <= radius) {
        nearbyVendors.push(`vendor:${vendor}`);
      }
    }
  }

  if (nearbyVendors.length > 0) {
    window.location.href = `https://order-app-ae.myshopify.com/search?q=${encodeURIComponent(item)}+${nearbyVendors.join(" OR ")}`;
  } else {
    document.getElementById("errorPopup").style.display = "block";
  }
}

function getActiveLocation() {
  const selectedLocation = localStorage.getItem('selectedLocation');
  const selectedLocationCoords = localStorage.getItem('selectedLocationCoords');

  if (selectedLocation && selectedLocationCoords) {
    return JSON.parse(selectedLocationCoords);
  }

  const currentLocation = localStorage.getItem('currentLocation');
  const locationExpiry = localStorage.getItem('locationExpiry');

  if (currentLocation && locationExpiry && Date.now() < parseInt(locationExpiry)) {
    return JSON.parse(currentLocation);
  }

  return null;
}

function showSelectLocationPopup() {
  const selectLocationPopup = document.getElementById("selectLocationPopup");
  selectLocationPopup.style.display = "block";
  setTimeout(() => {
    selectLocationPopup.style.display = "none";
  }, 4000);
}

// Keep the existing getDistance function
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
