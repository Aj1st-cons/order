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

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function useCurrentLocation() {
    if (navigator.geolocation) {
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
    popupBox.style.backgroundColor = "#EEEEEE";
    popupBox.style.color = "#000";
    popupBox.style.borderRadius = "5px";
    popupBox.style.textAlign = "center";
    popupBox.style.justifyContent = "center";
    popupBox.style.display = "flex";
    popupBox.style.flexDirection = "column";
    popupBox.style.outline = "2px solid #009500";  // 2px outline with the specified color
    popupBox.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 1)";  // Left and bottom shadow with opacity 1, spread to 5px

    let messageText = document.createElement("p");
    messageText.textContent =
        "Unable to read your location. Please turn <b>ON</b> location services in device.";

    // OK Button
    let okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = () => {
        popupOverlay.remove();
    };
    okButton.style.marginTop = "10px";
    okButton.style.backgroundColor = "#009500";  // Button background color
    okButton.style.color = "#fff";  // Button text color
    okButton.style.fontWeight = "bold";  // Button text bold
    okButton.style.padding = "10px 20px";  // Add padding to button for better size
    okButton.style.border = "none";  // Remove default button border
    okButton.style.cursor = "pointer";  // Change cursor to pointer when hovering over button
    okButton.style.borderRadius = "5px";  // Rounded corners for button

    popupBox.appendChild(messageText);
    popupBox.appendChild(okButton);
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);
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
  
function saveDeviceLocation() {
    if (navigator.geolocation) {
        disableClicks(); // Block all clicks
        showFetchingLocation(); // Show fetching location text with spinner

        let countdown = 30; // Set countdown for 30 seconds
        let countdownInterval = setInterval(() => {
            updateCountdown(countdown);
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval); // Stop countdown
                hideFetchingLocation(); // Hide fetching location text and spinner
                enableClicks(); // Restore clicks
                showLocationServicesPopup(); // Show popup after 30 seconds if no location
            }
        }, 1000); // Update countdown every second

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearInterval(countdownInterval); // Stop countdown
                setTimeout(() => {
                    hideFetchingLocation(); // Hide fetching location text and spinner
                    enableClicks(); // Restore clicks
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
                clearInterval(countdownInterval); // Stop countdown on error
                hideFetchingLocation(); // Hide fetching location text and spinner
                enableClicks(); // Restore clicks
                showLocationError(error); // Show location error
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Block all clicks
function disableClicks() {
    document.body.style.pointerEvents = "none";
}

// Enable clicks
function enableClicks() {
    document.body.style.pointerEvents = "";
}

// Functions for fetching location text and countdown
function showFetchingLocation() {
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

    updateCountdown(30); // Start countdown at 30 seconds
}

function hideFetchingLocation() {
    let wrapper = document.getElementById("countdown-wrapper");
    if (wrapper) {
        wrapper.remove();
    }
}

function updateCountdown(seconds) {
    let timerText = document.getElementById("countdown-timer");
    if (timerText) {
        timerText.textContent = `Fetching location... ${seconds}s`;
    }
}

// Popup for location services error (30-second timeout case)
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
    popupBox.style.justifyContent = "center";
    popupBox.style.display = "flex";
    popupBox.style.flexDirection = "column";
    popupBox.style.outline = "2px solid #009500";
    popupBox.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 1)";

    let messageText = document.createElement("p");
    messageText.textContent =
        "Unable to read your location. Please turn <b>ON</b> location services in device.";

    // OK Button
    let okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = () => {
        popupOverlay.remove();
    };
    okButton.style.marginTop = "10px";
    okButton.style.backgroundColor = "#009500";
    okButton.style.color = "#fff";
    okButton.style.fontWeight = "bold";
    okButton.style.padding = "10px 20px";
    okButton.style.border = "none";
    okButton.style.cursor = "pointer";
    okButton.style.borderRadius = "5px";

    popupBox.appendChild(messageText);
    popupBox.appendChild(okButton);
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);
}

// Open save location popup
function openSaveLocationPopup() {
    let popupOverlay = document.createElement("div");
    popupOverlay.id = "saveLocationPopup";
    popupOverlay.style.position = "fixed";
    popupOverlay.style.top = "50%";
    popupOverlay.style.left = "50%";
    popupOverlay.style.transform = "translate(-50%, -50%)";
    popupOverlay.style.padding = "20px";
    popupOverlay.style.backgroundColor = "#fff";
    popupOverlay.style.color = "#000";
    popupOverlay.style.borderRadius = "5px";
    popupOverlay.style.textAlign = "center";
    popupOverlay.style.zIndex = "10000";
    popupOverlay.innerHTML = `
        <p>Enter a name for this location:</p>
        <input type="text" id="saveLocationInput" placeholder="Location Name">
        <br><br>
        <button id="saveLocationConfirm" style="background-color: #009500; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Save</button>
    `;
    document.body.appendChild(popupOverlay);
}

// Close save location popup
function closeSaveLocationPopup() {
    let popup = document.getElementById("saveLocationPopup");
    if (popup) {
        popup.remove();
    }
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
