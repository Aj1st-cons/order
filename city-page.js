let isMainPopupOpen = false; // Tracks if the main popup is open

// Function to toggle the main popup
function togglePopup(id) {
  const mainPopup = document.getElementById(id);

  if (!mainPopup) return;

  if (!isMainPopupOpen) {
    // Open the main popup
    mainPopup.style.display = 'block';
    closeInnerPopups(); // Close any inner popups
    isMainPopupOpen = true;
  } else {
    // Reset the main popup by closing inner popups
    closeInnerPopups();
  }
}

// Function to open an inner popup
function openInnerPopup(id) {
  const innerPopup = document.getElementById(id);

  if (innerPopup) {
    closeInnerPopups(); // Close any currently open inner popups
    innerPopup.style.display = 'block'; // Display the specific inner popup
  }
}

// Function to close all inner popups
function closeInnerPopups() {
  const innerPopups = document.querySelectorAll('.inner-popup'); // Find all inner popups
  innerPopups.forEach(popup => {
    popup.style.display = 'none'; // Hide each inner popup
  });
}

    window.onload = function() {
        openPopup('home');
    };           

// Add event listener to the close button
document.querySelectorAll('.close-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    // Find the closest popup that contains the close button
    const currentPopup = e.target.closest('.popup');
    if (currentPopup) {
      currentPopup.style.display = 'none'; // Close the current popup
    }

    // Show the 'popup-emirates'
    const popupEmirates = document.getElementById('popup-emirates');
    if (popupEmirates) {
      popupEmirates.style.display = 'block'; // Show the popup-emirates
    }
  });
});

// Get the popup and the link
const popup = document.getElementById('popup-emirates');
const changeLocation = document.getElementById('change-location');

// Add a click event listener to toggle the Emirates popup
changeLocation.addEventListener('click', () => {
  popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
});

// Get the popups for each emirate
const popupDubai = document.getElementById('popup-dubai');
const popupSharjah = document.getElementById('popup-sharjah');
const popupAbuDhabi = document.getElementById('popup-abudhabi');
const popupAjman = document.getElementById('popup-ajman');
const popupUAQ = document.getElementById('popup-uaq');
const popupRAK = document.getElementById('popup-rak');
const popupFujairah = document.getElementById('popup-fujairah');



// Define a mapping between Emirates IDs and their corresponding popup variables
const emirates = {
  du: popupDubai,
  shj: popupSharjah,
  ad: popupAbuDhabi,
  aj: popupAjman,
  uaq: popupUAQ,
  rak: popupRAK,
  fuj: popupFujairah,
};

// Add a single event listener for each Emirates button
Object.keys(emirates).forEach((id) => {
  document.getElementById(id).addEventListener('click', () => {
    popup.style.display = 'none'; // Hide Emirates popup
    emirates[id].style.display = 'block'; // Show the corresponding popup
  });
});




  // Function to fetch cities from an external link and store selected city page
  async function fetchCities(url, containerId) {
    try {
      // Fetch HTML content from the external link
      const response = await fetch(url);
      const html = await response.text();

      // Insert the fetched HTML into the specified container
      document.getElementById(containerId).innerHTML = html;

      // Add click event listeners to city links after fetching
      const cityLinks = document.querySelectorAll(`#${containerId} .emirate`);
      cityLinks.forEach((link) => {
        link.addEventListener("click", () => {
          // Save the link to localStorage
          const cityUrl = link.href;
          localStorage.setItem("savedLink", cityUrl);
          localStorage.setItem("linkTimestamp", Date.now());
          console.log(`Saved City URL: ${cityUrl}`);
        });
      });
    } catch (error) {
      console.error(`Error fetching cities for ${containerId}:`, error);
    }
  }

  // Script to update the saved URL on every page load
  document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.href;

    // Save the current page's URL
    localStorage.setItem("savedLink", currentUrl);
    localStorage.setItem("linkTimestamp", Date.now());
    console.log(`Saved URL: ${currentUrl}`);

    // Fetch cities for all Emirates on page load
    fetchCities("https://order-1ib.pages.dev/cities-dubai.html", "cities-dubai");
    fetchCities("https://order-1ib.pages.dev/cities-abudhabi.html", "cities-abudhabi");
    fetchCities("https://order-1ib.pages.dev/cities-sharjah.html", "cities-sharjah");
    fetchCities("https://order-1ib.pages.dev/cities-ajman.html", "cities-ajman");
    fetchCities("https://order-1ib.pages.dev/cities-um-al-quain.html", "cities-uaq");
    fetchCities("https://order-1ib.pages.dev/cities-ras-al-khaimah.html", "cities-rak");
    fetchCities("https://order-1ib.pages.dev/cities-fujairah.html", "cities-fujairah");
  });
