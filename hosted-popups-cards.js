function openPopup(id) {
            const popup = document.getElementById(id);
            popup.style.display = "block"; // Show the popup
            document.body.style.overflow = "hidden"; // Disable scrolling on the main page
        }

        function closePopup(id) {
            const popup = document.getElementById(id);
            popup.style.display = "none"; // Hide the popup
            document.body.style.overflow = "auto"; // Enable scrolling on the main page
        }
        
  document.addEventListener("DOMContentLoaded", () => {
    const loadContent = (url, containerId) => {
      const container = document.getElementById(containerId);
      fetch(url)
        .then(response => response.text())
        .then(html => {
          container.innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${containerId}:`, error));
    };

loadContent("https://order-1ib.pages.dev/categories-cards.html", "categories");             
              loadContent("https://order-1ib.pages.dev/Vegitables.html", "vegitables");
              loadContent("https://order-1ib.pages.dev/Oils.html", "oils");
              loadContent("https://order-1ib.pages.dev/Fruits.html", "fruits"); 
              loadContent("https://order-1ib.pages.dev/Bakery.html", "bakery");
              loadContent("https://order-1ib.pages.dev/Beverages.html", "beverages");
              loadContent("https://order-1ib.pages.dev/Dairy.html", "dairy");
              loadContent("https://order-1ib.pages.dev/Meat.html", "meat");
  });









// Function to load the external HTML containing the popups
function loadPopups(url) {
  // Create an XMLHttpRequest to fetch the external HTML file
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  // When the request is loaded successfully
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Create a temporary container to hold the fetched HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = xhr.responseText;

      // Append the fetched popups to the body or a specific container
      document.body.appendChild(tempDiv);
      console.log("Popups loaded successfully!");
    } else {
      console.error(`Failed to load popups. Status: ${xhr.status}`);
    }
  };

  // Handle network or other errors
  xhr.onerror = function () {
    console.error("An error occurred while loading the popups.");
  };

  // Send the request
  xhr.send();
}

// Call the function to load the popups
// Replace 'open-inner-popups.html' with the actual URL of your hosted file
loadPopups("https://order-1ib.pages.dev/open-inner-popups.html");

