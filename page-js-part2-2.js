function getSavedLocation() {
    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));
    if (savedLocation) {
        return savedLocation;
    }
    return null;
}


function updateReplaceableText(location) {
    let replaceableText = document.querySelector(".replaceable-text");
    if (!location) return;

    if (location.type === "device") {
        let closestCity = null;
        let minDistance = Infinity;

        for (const region in locations) {
            for (const city in locations[region]) {
                const cityCoords = locations[region][city];
                const distance = getDistance(
                    location.lat, location.lng,
                    cityCoords.lat, cityCoords.lng
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = city;
                }
            }
        }

        // Using 1km threshold for displaying the closest city
        replaceableText.innerText = (closestCity && minDistance <= 1) ? closestCity : "Current Location";
    } else {
        replaceableText.innerText = location.name || "Saved Location";
    }
}
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    function showLocationPopup() {
        let locationList = `<h4 class="current-location" onclick="useCurrentLocation()">Current Location</h4>`;

        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedLocation) {
            locationList += `<h4 class="current-location" onclick="useSavedLocation()">${savedLocation.name}</h4>`;
        } else {
            locationList += `<h4 class="current-location" onclick="saveDeviceLocation()">Save Location</h4>`;
        }

        for (const region in locations) {
            locationList += `<h4 onclick="openCityPopup('${region}')">${region}</h4>`;
        }
        document.getElementById("locationsList").innerHTML = locationList;
        document.getElementById("locationPopup").style.display = "block";
    }
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // Function to open the edit popup
    function openEditPopup() {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (!savedLocation) {
            alert("No saved location to edit.");
            return;
        }

  // Set the current name in the input field
        document.getElementById("editNameInput").value = savedLocation.name;

        // Display the edit popup
        document.getElementById("editPopup").style.display = "block";
    }

    // Function to handle the "Yes" button click
    function handleEditYes() {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        const newName = document.getElementById("editNameInput").value;

        if (newName) {
            // Update the name
            savedLocation.name = newName;

            // Retrieve new location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        savedLocation.lat = position.coords.latitude;
                        savedLocation.lng = position.coords.longitude;
                        savedLocation.timestamp = Date.now();

                        // Save the updated location
                        localStorage.setItem("savedLocation", JSON.stringify(savedLocation));
                        updateReplaceableText(savedLocation); // Refresh the UI
                        closeEditPopup();
                        showLocationPopup(); // Refresh the location popup
                    },
                    () => {
                        alert("Failed to retrieve new location. Name updated, but coordinates remain the same.");
                        localStorage.setItem("savedLocation", JSON.stringify(savedLocation));
                        closeEditPopup();
                        showLocationPopup();
                    }
                );
            } else {
                alert("Geolocation is not supported. Name updated, but coordinates remain the same.");
                localStorage.setItem("savedLocation", JSON.stringify(savedLocation));
                closeEditPopup();
                showLocationPopup();
            }
        } else {
            alert("Please enter a valid name.");
        }
    }

    // Function to handle the "No" button click
    function handleEditNo() {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        const newName = document.getElementById("editNameInput").value;

        if (newName) {
            // Update only the name
            savedLocation.name = newName;
            localStorage.setItem("savedLocation", JSON.stringify(savedLocation));
            updateReplaceableText(savedLocation); // Refresh the UI
        }

        closeEditPopup();
        showLocationPopup(); // Refresh the location popup
    }

    // Function to close the edit popup
    function closeEditPopup() {
        document.getElementById("editPopup").style.display = "none";
    }

    // Function to show the location popup with the edit button
    function showLocationPopup() {
        let locationList = `<h4 class="current-location" onclick="useCurrentLocation()">Current Location</h4>`;

        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedLocation) {
            // Add the saved location with an edit button
            locationList += `
                <h4 class="current-location" onclick="useSavedLocation()">
                    ${savedLocation.name}
                    <i class="fa-solid fa-rotate" style="color: #009500; cursor: pointer; margin-left: 10px;" onclick="event.stopPropagation(); openEditPopup()"></i>
                </h4>
            `;
        } else {
            locationList += `<h4 class="current-location" onclick="saveDeviceLocation()">Save Location</h4>`;
        }

        for (const region in locations) {
            locationList += `<h4 onclick="openCityPopup('${region}')">${region}</h4>`;
        }

        document.getElementById("locationsList").innerHTML = locationList;
        document.getElementById("locationPopup").style.display = "block";
    }
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   
    // Initialize on page load
    getUserLocation();
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    
