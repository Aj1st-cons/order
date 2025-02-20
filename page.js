//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    //LOCATION PROMPT POPUP
        window.addEventListener("load", function() {
        let savedLocation = getSavedLocation();
        if (!savedLocation) {
            setTimeout(function() {
                const locationPrompt = document.getElementById("locationPromptPopup");
                locationPrompt.style.display = "block";
                setTimeout(() => locationPrompt.style.display = "none", 3000);
            }, 3000);
        }
    });
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      
//××××××××××××××××××××××××××××××××        
       function showItems(category) {

        fetch(categoryUrls[category])
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, "text/html");
                let items = [];

                doc.querySelectorAll(".item-card").forEach(card => {
                    let img = card.querySelector("img")?.src;
                    let name = card.querySelector("p")?.textContent;
                    if (img && name) items.push({ name, image: img });
                });

                let itemList = `<div class="item-grid">`;
                items.forEach(item => {
                    itemList += `
                        <div class="item-card" onclick="searchItem('${item.name}')">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                            <p>${item.name}</p>
                        </div>
                    `;
                });
                itemList += `</div>`;
                document.getElementById("itemList").innerHTML = itemList;
                document.getElementById("itemPopup").style.display = "block";
            })
            .catch(error => {
                console.error("Error loading items:", error);
                document.getElementById("errorPopup").style.display = "block";
            });
    }
  
  function closeErrorPopup() {
    document.getElementById("errorPopup").style.display = "none";
}    

//×××××××÷÷×××××××××××××××××××××
    function openCityPopup(region) {
        let cityList = ``;
        for (const city in locations[region]) {
            cityList += `<h4 onclick="selectCity('${city}', ${locations[region][city].lat}, ${locations[region][city].lng})">${city}</h4>`;
        }
        document.getElementById("cityList").innerHTML = cityList;
        document.getElementById("cityPopup").style.display = "block";
        document.getElementById("locationPopup").style.display = "none";
    }

    function selectCity(city, lat, lng) {
        const selectedLocation = {
            name: city,
            lat: lat,
            lng: lng,
            type: "saved"
        };
        saveLocation(selectedLocation);
        updateReplaceableText(selectedLocation);
        closePopup();
    }

    function showLocationError() {
        document.getElementById("locationErrorPopup").style.display = "block";
    }

    function closePopup() {
        document.querySelectorAll(".popup, .popup2").forEach(popup => {
            popup.style.display = "none";
        });
    }

    function goBackToLocations() {
        document.getElementById('cityPopup').style.display = 'none';
        document.getElementById('locationPopup').style.display = 'flex';
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
  
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

     function searchStores(stores) {
        let userLocation = getSavedLocation();

        if (!userLocation) {
            const locationPopup = document.getElementById("selectLocationPopup");
            locationPopup.style.display = "block";
            setTimeout(() => {
                locationPopup.style.display = "none";
            }, 4000);
            return;
        }

        let nearbyVendors = [];
let selectedCategory = document.querySelector(".stores-card p").textContent.trim();

for (const vendor in vendors) {
    let distance = getDistance(
        userLocation.lat, userLocation.lng,
        vendors[vendor].lat, vendors[vendor].lng
    );
    if (distance <= 1 && vendors[vendor].categories.includes(selectedCategory)) {
        nearbyVendors.push(`${vendor}`);
    }
}

if (nearbyVendors.length > 0) {
            window.location.href = `https://order-app-ae.myshopify.com/pages/stores?collections=${nearbyVendors.join(",")}`; 
        } else {
                    document.getElementById("errorPopup").style.display = "block";
        }
    }

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
