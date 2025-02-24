function useCurrentLocation() {
    if (navigator.geolocation) {
        closeLocationPopup(); 
        disableClicks(); 
        showCountdownTimer();

        let countdown = 30;
        let countdownInterval = setInterval(() => {
            updateCountdown(countdown);
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                hideCountdownTimer();
                enableClicks(); 
                showLocationServicesPopup();
            }
        }, 1000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearInterval(countdownInterval); 
                hideCountdownTimer(); 
                enableClicks();
                
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
                clearInterval(countdownInterval); 
                hideCountdownTimer();
                enableClicks(); 
                showLocationError();
            }
        );
    } else {
        showLocationError();
    }
}

function closeLocationPopup() {
    let popup = document.getElementById("locationPopup");
    if (popup) {
        popup.remove();
    }
}

function disableClicks() {
    document.body.style.pointerEvents = "none";
}

function enableClicks() {
    document.body.style.pointerEvents = "";
}

function showCountdownTimer() {
    closeLocationPopup();

    let wrapper = document.createElement("div");
    wrapper.id = "countdown-wrapper";
    wrapper.innerHTML = `
        <div id="loading-spinner"></div>
        <div id="countdown-timer">Fetching location... 30s</div>
    `;
    document.body.appendChild(wrapper);
}

function updateCountdown(seconds) {
    let timerDiv = document.getElementById("countdown-timer");
    if (timerDiv) {
        timerDiv.textContent = `Fetching location... ${seconds}s`;
    }
}

function hideCountdownTimer() {
    let wrapper = document.getElementById("countdown-wrapper");
    if (wrapper) {
        wrapper.remove();
    }
}

function showLocationServicesPopup() {
    let popupOverlay = document.createElement("div");
    popupOverlay.id = "popup-overlay";

    let popupBox = document.createElement("div");
    popupBox.id = "popup-box";
    popupBox.innerHTML = `
        <p><strong>Unable to get your location</strong><br><span style="font-size:10px;">Please check your location services in device settings.</span></p>
        <button id="popup-ok">OK</button>
    `;
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);

    document.getElementById("popup-ok").onclick = () => {
        popupOverlay.remove();
    };
}    
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function saveDeviceLocation() {
    if (navigator.geolocation) {
        closeLocationPopup(); 
        disableClicks(); 
        showCountdownTimer();

        let countdown = 30;
        let countdownInterval = setInterval(() => {
            updateCountdown(countdown);
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                hideCountdownTimer();
                enableClicks(); 
                showLocationServicesPopup();
            }
        }, 1000);
 

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => {
                    clearInterval(countdownInterval); 
                    hideCountdownTimer(); 
                    enableClicks();                    
                    closeLocationPopup(); 
                    openSaveLocationPopup(); 

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
                }, 1000); 
            },                                                                                   
            (error) => {
                hideCountdownTimer();
                enableClicks(); 
                showLocationError();
            }
        );
    } else {
        showLocationError();
    }
}
            
function disableClicks() {
    document.body.style.pointerEvents = "none";
}

function enableClicks() {
    document.body.style.pointerEvents = "";
}

function showCountdownTimer() {
    closeLocationPopup();

    let wrapper = document.createElement("div");
    wrapper.id = "countdown-wrapper";
    wrapper.innerHTML = `
        <div id="loading-spinner"></div>
        <div id="countdown-timer">Fetching location... 30s</div>
    `;
    document.body.appendChild(wrapper);
}

function updateCountdown(seconds) {
    let timerDiv = document.getElementById("countdown-timer");
    if (timerDiv) {
        timerDiv.textContent = `Fetching location... ${seconds}s`;
    }
}

function hideCountdownTimer() {
    let wrapper = document.getElementById("countdown-wrapper");
    if (wrapper) {
        wrapper.remove();
    }
}

function showLocationServicesPopup() {
    let popupOverlay = document.createElement("div");
    popupOverlay.id = "popup-overlay";

    let popupBox = document.createElement("div");
    popupBox.id = "popup-box";
    popupBox.innerHTML = `
        <p><strong style='color: red;'>Error</strong><br><br>Unable to get your location. Please check your location services in device settings.</p>
        <button id="popup-ok">OK</button>
    `;

    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);

    document.getElementById("popup-ok").onclick = () => {
        popupOverlay.remove();
    };
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
          
function useSavedLocation() {
    const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
    if (savedLocation) {
        updateReplaceableText(savedLocation);
        saveLocation(savedLocation);
        closePopup();
    }
} 
