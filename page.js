async function loadCategories() {
      try {
          let response = await fetch('https://order-1ib.pages.dev/categories.html');
          if (!response.ok) throw new Error('Failed to load categories');

          let html = await response.text();
          document.getElementById('categories').innerHTML = html;
      } catch (error) {
          console.error('Error loading categories:', error);
      }
  }

  loadCategories();
  
    function showItems(category) {
        const categoryUrls = {
            "vegetables": "https://order-1ib.pages.dev/Vegetables.html",
            "fruits": "https://order-1ib.pages.dev/Fruits.html",
            "meat": "https://order-1ib.pages.dev/Meat.html",
            "seafood": "https://order-1ib.pages.dev/Seafood.html"
        };

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

let locations = {
    "Dubai": { 
"City A1": { lat: 25.123, lng: 55.123 }, 
"City A2": { lat: 25.223, lng: 55.223 }, 
"City A3": { lat: 25.323, lng: 55.323 },
"City A4": { lat: 25.123, lng: 55.123 }, 
"City A5": { lat: 25.223, lng: 55.223 }, 
"City A6": { lat: 25.323, lng: 55.323 },
"City A7": { lat: 25.123, lng: 55.123 }, 
"City A8": { lat: 25.223, lng: 55.223 }, 
"City A9": { lat: 25.323, lng: 55.323 },
"City A10": { lat: 25.123, lng: 55.123 }, 
"City A11": { lat: 25.223, lng: 55.223 }, 
"City A12": { lat: 25.323, lng: 55.323 },
"City A13": { lat: 25.123, lng: 55.123 }, 
"City A14": { lat: 25.223, lng: 55.223 }, 
"City A15": { lat: 25.323, lng: 55.323 } 
    },
    "Abu Dhabi": { 
"City C1": { lat: 27.123, lng: 57.123 }, 
"City C2": { lat: 27.223, lng: 57.223 }, 
"City C3": { lat: 27.323, lng: 57.323 } 
    },
    "Ajman": { 
"City C1": { lat: 27.123, lng: 57.123 }, 
"City C2": { lat: 27.223, lng: 57.223 }, 
"City C3": { lat: 27.323, lng: 57.323 } 
    },
    "UAQ": { 
"City C1": { lat: 27.123, lng: 57.123 }, 
"City C2": { lat: 27.223, lng: 57.223 }, 
"City C3": { lat: 27.323, lng: 57.323 }  
    },
    "RAK": { 
"City C1": { lat: 27.123, lng: 57.123 }, 
"City C2": { lat: 27.223, lng: 57.223 }, 
"City C3": { lat: 27.323, lng: 57.323 }  
    },
    "Fujairah": { 
"City C1": { lat: 27.123, lng: 57.123 }, 
"City C2": { lat: 27.223, lng: 57.223 }, 
"City C3": { lat: 27.323, lng: 57.323 }  
    }
};

let vendors = {
"A": { lat: 25.125, lng: 55.126 },
"AJ": { lat: 24.396973, lng: 54.588957 },
"AD": { lat: 24.391549, lng: 54.578581 },
"ND": { lat: 26.125, lng: 56.126 },
"GF": { lat: 25.225, lng: 55.226 },
"C": { lat: 26.125, lng: 56.126 },        
"D": { lat: 27.125, lng: 57.126 }
};

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
