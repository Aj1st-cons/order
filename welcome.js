document.addEventListener("DOMContentLoaded", function () {
    const welcomeScreen = document.getElementById("welcome");
    const footer = document.querySelector("footer");

    // Hide footer visually but keep its space
    if (footer) {
        footer.style.visibility = "hidden";
        footer.style.opacity = "0";
        footer.style.transition = "opacity 0.5s ease-in-out";
    }

    // Show welcome screen for 2 seconds
    setTimeout(() => {
        welcomeScreen.style.display = "none";
        
        // Fade-in footer smoothly
        if (footer) {
            footer.style.visibility = "visible";
            footer.style.opacity = "1";
        }
    }, 2000);
});
