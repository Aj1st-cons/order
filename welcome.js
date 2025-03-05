document.addEventListener("DOMContentLoaded", function () {
    const welcomeScreen = document.getElementById("welcome");
    const lastShown = localStorage.getItem("welcomeLastShown");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    if (!lastShown || now - lastShown > oneHour) {
        setTimeout(() => {
            welcomeScreen.style.display = "none";
            localStorage.setItem("welcomeLastShown", now);
        }, 15000);
    } else {
        welcomeScreen.style.display = "none";
    }
});
