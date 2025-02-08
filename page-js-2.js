    function getUserLocation() {
        let savedLocation = getSavedLocation();

        if (savedLocation) {
            updateReplaceableText(savedLocation);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now(),
                        type: "device"
                    };
                    saveLocation(userLocation);
                    updateReplaceableText(userLocation);
                },
                () => {
                    if (!savedLocation) {
                        showLocationPopup();
                    }
                },
                { timeout: 10000 }
            );
        } else if (!savedLocation) {
            showLocationPopup();
        }
    }

    function saveLocation(location) {
        localStorage.setItem("userLocation", JSON.stringify(location));
    }

    function getSavedLocation() {
    let savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
        savedLocation = JSON.parse(savedLocation);

        let expiryTime;
        if (savedLocation.type === "device") {
            expiryTime = 1200000; // 20 minutes
        } else if (savedLocation.type === "saved") {
            expiryTime = Infinity; // Never expires
        } else if (savedLocation.type === "city") {
            expiryTime = 3600000; // 1 hour
        }

        if (expiryTime !== Infinity && Date.now() - savedLocation.timestamp > expiryTime) {
            localStorage.removeItem("userLocation");
            return null;
        }
        return savedLocation;
    }
    return null;
}

//××××××××××××××××××××××××××××××××××××

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

            replaceableText.innerText = closestCity && minDistance <= 50 ? closestCity : "Current Location";
        } else {
            replaceableText.innerText = location.name || "Saved Location";
        }
    }

//×××××××××××××××××××××××××××××××

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

    function useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now(),
                        type: "device"
                    };
                    saveLocation(userLocation);
                    updateReplaceableText(userLocation);
                    closePopup();
                },
                () => {
                    showLocationError();
                }
            );
        } else {
            showLocationError();
        }
    }

//××××××××××××××××××××××××××××××××××××

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

//××××××××××××××××××××××××××××××××××
//××××××××××××××××××××××××××××××××××
  
function saveDeviceLocation() {
    if (navigator.geolocation) {
        // Show loading animation immediately
        showLoadingAnimation();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Add a delay before showing the save location popup
                setTimeout(() => {
                    hideLoadingAnimation(); // Hide loading animation
                    closeLocationPopup(); // Close locationPopup immediately
                    openSaveLocationPopup(); // Open saveLocationPopup

                    // Prevent closing until required action is taken
                    document.getElementById("saveLocationConfirm").onclick = function () {
                        const customName = document.getElementById("saveLocationInput").value.trim();
                        if (customName) {
                            const savedLocation = {
                                name: customName,
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                type: "saved"
                            };
                            localStorage.setItem("savedLocation", JSON.stringify(savedLocation));
                            updateReplaceableText(savedLocation);
                            closeSaveLocationPopup();
                            setTimeout(() => location.reload(), 500);
                        } else {
                            alert("Please enter a name for this location.");
                        }
                    };
                }, 1000); // Delay of 1 second
            },
            (error) => {
                hideLoadingAnimation(); // Hide loading animation on error
                showLocationError(error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function showLoadingAnimation() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.display = "flex"; // Show loading overlay
}

function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.display = "none"; // Hide loading overlay
}

function closeLocationPopup() {
    const locationPopup = document.getElementById("locationPopup");
    if (locationPopup) locationPopup.style.display = "none";
}

function openSaveLocationPopup() {
    const saveLocationPopup = document.getElementById("saveLocationPopup");
    saveLocationPopup.style.display = "block"; // Show the popup
}

function closeSaveLocationPopup() {
    const saveLocationPopup = document.getElementById("saveLocationPopup");
    saveLocationPopup.style.display = "none"; // Hide the popup
}

//××××××××××××××××××××××××××××××××××
//××××××××××××××××××××××××××××××××××
          
    function useSavedLocation() {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedLocation) {
            updateReplaceableText(savedLocation);
            saveLocation(savedLocation); // Set as the current active location
            closePopup();
        }
    }

//×××××××××××××××××××××××××××××××××
   
    function searchItem(item) {
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
        for (const vendor in vendors) {
            let distance = getDistance(
                userLocation.lat, userLocation.lng,
                vendors[vendor].lat, vendors[vendor].lng
            );
            if (distance <= 1) nearbyVendors.push(`vendor:${vendor}`);
        }

        if (nearbyVendors.length > 0) {
            window.location.href = `https://order-app-ae.myshopify.com/search?q=${encodeURIComponent(item)}+${nearbyVendors.join(" OR ")}`;
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

    // Initialize on page load
    getUserLocation();

