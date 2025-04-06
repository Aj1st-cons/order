let renameTarget = '';
let countdownInterval;

function showLocationPopup() {
    document.getElementById('locationPopup').style.display = 'block';
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.replaceable-text') && !event.target.closest('.location-container') && !event.target.closest('.icon-container')) {
        document.getElementById('locationPopup').style.display = 'none';
    }
});

document.querySelector('.icon-container').addEventListener('click', showLocationPopup);

function loadLocations() {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) document.querySelector('.replaceable-text').textContent = savedLocation;

    for (let i = 1; i <= 5; i++) {
        const savedName = localStorage.getItem(`loc${i}-name`);
        if (savedName) document.getElementById(`loc${i}`).querySelector('span').textContent = savedName;
    }
}

function setCurrentLocation() {
    startLoading();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
            localStorage.setItem('currentLocation', JSON.stringify(coords));
            localStorage.setItem('locationExpiry', Date.now() + 3600000);
            saveAndDisplayLocation('Current Location', coords);
            stopLoading();
        }, () => {
            stopLoading();
            showErrorPopup();
        });
    } else {
        stopLoading();
        showErrorPopup();
    }
}

function setLocationFromStorage(targetId) {
    const storedName = localStorage.getItem(`${targetId}-name`);
    const storedCoords = localStorage.getItem(`${targetId}-coords`);
    if (storedName && storedCoords) saveAndDisplayLocation(storedName, JSON.parse(storedCoords));
}

function saveAndDisplayLocation(name, coords) {
    document.querySelector('.replaceable-text').textContent = name;
    localStorage.setItem('selectedLocation', name);
    localStorage.setItem('selectedLocationCoords', JSON.stringify(coords));
    document.getElementById('locationPopup').style.display = 'none';
}

function openRenamePopup(targetId) {
    renameTarget = targetId;
    document.getElementById('renameInput').value = localStorage.getItem(`${targetId}-name`) || '';
    document.getElementById('renameModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeRenamePopup() {
    document.getElementById('renameModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function saveRename() {
    const newName = document.getElementById('renameInput').value.trim();
    if (newName) {
        startLoading();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = { lat: position.coords.latitude, lon: position.coords.longitude };

                let storedKeys = JSON.parse(localStorage.getItem('savedLocations')) || [];
                if (!storedKeys.includes(renameTarget)) {
                    if (storedKeys.length >= 5) storedKeys.shift();
                    storedKeys.push(renameTarget);
                    localStorage.setItem('savedLocations', JSON.stringify(storedKeys));
                }

                localStorage.setItem(`${renameTarget}-name`, newName);
                localStorage.setItem(`${renameTarget}-coords`, JSON.stringify(coords));
                document.getElementById(renameTarget).querySelector('span').textContent = newName;

                saveAndDisplayLocation(newName, coords);
                stopLoading();
                closeRenamePopup();
            }, () => {
                stopLoading();
                showErrorPopup();
            });
        }
    }
}

function startLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
    let countdown = 30;
    document.getElementById('countdown').textContent = `please wait ${countdown}s`;
    countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = 'please wait ${countdown}s`;
        if (countdown <= 0) {
            stopLoading();
            showErrorPopup();
        }
    }, 1000);
}

function stopLoading() {
    clearInterval(countdownInterval);
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showErrorPopup() {
    document.getElementById('errorPopup').style.display = 'block';
}

function closeErrorPopup() {
    document.getElementById('errorPopup').style.display = 'none';
}

loadLocations();
