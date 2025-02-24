document.addEventListener("DOMContentLoaded", function () {
    const welcomeScreen = document.getElementById("welcome");
    const footer = document.querySelector("footer");
    const lastShown = localStorage.getItem("welcomeLastShown");
    const now = Date.now();
    const sixtyMinutes = 60 * 60 * 1000; // 15 minutes in milliseconds

    if (!lastShown || now - lastShown > sixtyMinutes) {
        // Show welcome screen and hide footer initially
        if (footer) {
            footer.style.visibility = "hidden";
            footer.style.opacity = "0";
            footer.style.transition = "opacity 0.5s ease-in-out";
        }

        setTimeout(() => {
            welcomeScreen.style.display = "none";
            
            // Fade-in footer smoothly
            if (footer) {
                footer.style.visibility = "visible";
                footer.style.opacity = "1";
            }

            // Store the timestamp
            localStorage.setItem("welcomeLastShown", now);
        }, 3000); // Show welcome screen for 1 seconds
    } else {
        // Hide welcome screen immediately if within 10 minutes
        welcomeScreen.style.display = "none";

        // Ensure footer is visible
        if (footer) {
            footer.style.visibility = "visible";
            footer.style.opacity = "1";
        }
    }
});
