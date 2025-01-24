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
             loadContent("https://order-1ib.pages.dev/Drinks.html", "drinks");
            loadContent("https://order-1ib.pages.dev/vegitables.html", "vegitables");
          loadContent("https://order-1ib.pages.dev/Fruits.html", "fruits");                        
  });
