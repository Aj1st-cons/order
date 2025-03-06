document.addEventListener("DOMContentLoaded", function () {
            const welcomeScreen = document.getElementById("welcome");
            const mainContent = document.getElementById("main-content");
            const now = new Date().getTime();
            const lastVisit = localStorage.getItem("lastVisit");

            if (lastVisit && now - lastVisit < 60 * 60 * 1000) { // If less than 60 minutes, skip welcome screen
                welcomeScreen.style.display = "none";
                mainContent.style.display = "block";
            } else {
                // Show welcome screen for 5 seconds, then hide
                setTimeout(() => {
                    welcomeScreen.style.display = "none";
                    mainContent.style.display = "block";
                    localStorage.setItem("lastVisit", now);
                }, 5000);
            }
        });
