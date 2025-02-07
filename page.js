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

//××××××××××××××××××××××××××××××××××××        

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
        document.getElementById("citiesList").innerHTML = cityList;
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
