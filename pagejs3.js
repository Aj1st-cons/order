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
        showLoadingAnimation(); // Show loading indicator

        navigator.geolocation.getCurrentPosition(
            (position) => {
                hideLoadingAnimation(); // Hide loading indicator
                
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
                hideLoadingAnimation(); // Hide loading on error
                showLocationError();
            }
        );
    } else {
        showLocationError();
    }
}

// Functions to control loading animation
function showLoadingAnimation() {
    let loader = document.createElement("div");
    loader.id = "location-loader";
    loader.innerHTML = "Fetching location...";
    loader.style.position = "fixed";
    loader.style.top = "50%";
    loader.style.left = "50%";
    loader.style.transform = "translate(-50%, -50%)";
    loader.style.padding = "10px 20px";
    loader.style.background = "rgba(0, 0, 0, 0.7)";
    loader.style.color = "#fff";
    loader.style.borderRadius = "5px";
    loader.style.zIndex = "9999";
    document.body.appendChild(loader);
}

function hideLoadingAnimation() {
    let loader = document.getElementById("location-loader");
    if (loader) {
        loader.remove();
    }
}
