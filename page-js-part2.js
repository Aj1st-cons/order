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
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
        function useSavedLocation() {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedLocation) {
            updateReplaceableText(savedLocation);
            saveLocation(savedLocation); // Set as the current active location
            closePopup();
        }
    }
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   
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
//××××××××××××××××××××××××××××××××××××××××    
    //FOOTER
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.home-btn').addEventListener('click', function() {
        document.querySelectorAll('.popup, .popup2').forEach(popup => {
            if (popup.style.display !== 'none') {
                popup.style.display = 'none';
            }
        });
    });
}); 

function saveDeviceLocation() {
    if (navigator.geolocation) {
        showLoadingAnimation(); // Show loading animation

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => {
                    hideLoadingAnimation(); // Hide loading animation
                    closeLocationPopup(); // Close locationPopup
                    openSaveLocationPopup(); // Open saveLocationPopup

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
                }, 1000); // Delay to ensure UI updates smoothly
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
    if (loadingOverlay) {
        loadingOverlay.style.display = "flex";
        console.log("Loading animation shown");
    } else {
        console.error("Error: Loading overlay not found!");
    }
}

function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = "none";
            console.log("Loading animation hidden");
        }, 500); // Small delay to prevent flickering
    }
}

function closeLocationPopup() {
    const locationPopup = document.getElementById("locationPopup");
    if (locationPopup) locationPopup.style.display = "none";
}

function openSaveLocationPopup() {
    const saveLocationPopup = document.getElementById("saveLocationPopup");
    if (saveLocationPopup) saveLocationPopup.style.display = "block";
}

function closeSaveLocationPopup() {
    const saveLocationPopup = document.getElementById("saveLocationPopup");
    if (saveLocationPopup) saveLocationPopup.style.display = "none";
}


//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


function useCurrentLocation() {
    if (navigator.geolocation) {
        closeLocationPopup(); // Close the location popup immediately
        disableClicks(); // Block all clicks
        showCountdownTimer(); // Show countdown timer with spinner

        let countdown = 30;
        let countdownInterval = setInterval(() => {
            updateCountdown(countdown);
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                hideCountdownTimer();
                enableClicks(); // Restore clicks
                showLocationServicesPopup(); // Show popup after timeout
            }
        }, 1000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearInterval(countdownInterval); // Stop countdown
                hideCountdownTimer(); // Hide countdown timer
                enableClicks(); // Restore clicks
                
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
                clearInterval(countdownInterval); // Stop countdown on error
                hideCountdownTimer();
                enableClicks(); // Restore clicks
                showLocationError();
            }
        );
    } else {
        showLocationError();
    }
}

// Function to close the location popup permanently
function closeLocationPopup() {
    let popup = document.getElementById("locationPopup");
    if (popup) {
        popup.remove();
    }
}

// Disable all clicks
function disableClicks() {
    document.body.style.pointerEvents = "none"; // Block all clicks
}

// Enable clicks again
function enableClicks() {
    document.body.style.pointerEvents = ""; // Restore clicks
}

// Show countdown timer with a loading spinner
function showCountdownTimer() {
    closeLocationPopup(); // Extra check to ensure popup is removed

    let wrapper = document.createElement("div");
    wrapper.id = "countdown-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translate(-50%, -50%)";
    wrapper.style.padding = "20px";
    wrapper.style.background = "rgba(0, 0, 0, 0.7)";
    wrapper.style.color = "#fff";
    wrapper.style.borderRadius = "5px";
    wrapper.style.zIndex = "9999";
    wrapper.style.textAlign = "center";
    wrapper.style.fontSize = "14px";
    wrapper.style.fontWeight = "bold";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    // Create spinner
    let spinner = document.createElement("div");
    spinner.id = "loading-spinner";
    spinner.style.width = "40px";
    spinner.style.height = "40px";
    spinner.style.border = "4px solid white";
    spinner.style.borderTop = "4px solid #009500";
    spinner.style.borderRadius = "50%";
    spinner.style.animation = "spin 1s linear infinite";
    spinner.style.marginBottom = "10px";

    // Create text
    let timerText = document.createElement("div");
    timerText.id = "countdown-timer";
    timerText.textContent = "Fetching location... 30s";

    // Append elements
    wrapper.appendChild(spinner);
    wrapper.appendChild(timerText);
    document.body.appendChild(wrapper);

    // Add spinner animation
    let style = document.createElement("style");
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Update countdown timer text
function updateCountdown(seconds) {
    let timerDiv = document.getElementById("countdown-timer");
    if (timerDiv) {
        timerDiv.textContent = `Fetching location... ${seconds}s`;
    }
}

// Hide countdown timer
function hideCountdownTimer() {
    let wrapper = document.getElementById("countdown-wrapper");
    if (wrapper) {
        wrapper.remove();
    }
}

// Popup for location services error
function showLocationServicesPopup() {
    let popupOverlay = document.createElement("div");
    popupOverlay.id = "popup-overlay";
    popupOverlay.style.position = "fixed";
    popupOverlay.style.top = "0";
    popupOverlay.style.left = "0";
    popupOverlay.style.width = "100%";
    popupOverlay.style.height = "100%";
    popupOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    popupOverlay.style.zIndex = "10000";

    let popupBox = document.createElement("div");
    popupBox.id = "popup-box";
    popupBox.style.position = "fixed";
    popupBox.style.top = "50%";
    popupBox.style.left = "50%";
    popupBox.style.transform = "translate(-50%, -50%)";
    popupBox.style.padding = "20px";
    popupBox.style.backgroundColor = "#fff";
    popupBox.style.color = "#000";
    popupBox.style.borderRadius = "5px";
    popupBox.style.textAlign = "center";

    let messageText = document.createElement("p");
    messageText.textContent =
        "Unable to fetch your location. Please check your location services in device settings.";

    // OK Button
    let okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = () => {
        popupOverlay.remove();
    };
    okButton.style.marginTop = "10px";

    popupBox.appendChild(messageText);
    popupBox.appendChild(okButton);
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);
}
