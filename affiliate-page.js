 //open vendorForm
        
document.addEventListener("DOMContentLoaded", function () {
  const addShopButton = document.getElementById("addShopBtn");
  const loginContainer = document.getElementById("loginContainer");
  const vendorForm = document.getElementById("vendorForm");

  addShopButton.addEventListener("click", function () {
    // Hide the login container
    loginContainer.style.display = "none";
    // Show the contact form
    vendorForm.style.display = "block";
  });
});

//---------------------------------------

document.getElementById("validate").addEventListener("click", function () {
    function generateRandomCode() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        let randomLetters = "";
        let randomNumbers = "";

        for (let i = 0; i < 3; i++) {
            randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
            randomNumbers += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return randomLetters + randomNumbers;
    }

    document.getElementById("refCode").value = generateRandomCode();
});

//---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const userIdInput = document.getElementById("userId");
    const vendorsCodeInput = document.getElementById("vendorsCode");
    const loginBtn = document.getElementById("loginBtn");
    const userIdError = document.getElementById("userIdError");
    const vendorsCodeError = document.getElementById("vendorsCodeError");
    const vendorDashboard = document.getElementById("vendorDashboard");

    // Check if user is already logged in
    const savedUser = JSON.parse(localStorage.getItem("loggedInVendor"));
    if (savedUser) {
        showDashboard();
        return;
    }

    loginBtn.addEventListener("click", function () {
        const enteredEmail = userIdInput.value.trim();
        const enteredVendorCode = vendorsCodeInput.value.trim();

        if (!enteredEmail || !enteredVendorCode) {
            userIdError.textContent = enteredEmail ? "" : "User ID is required.";
            vendorsCodeError.textContent = enteredVendorCode ? "" : "Vendor Code is required.";
            return;
        }

        // Fetch the JSON data
        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then(response => response.json())
            .then(data => {
                // Check if any vendor matches the input credentials
                const matchedVendor = data.find(vendor => 
                    vendor.affiliateEmail === enteredEmail && vendor.refCode === enteredVendorCode
                );

                if (matchedVendor) {
                    // Save user details in localStorage
                    localStorage.setItem("loggedInVendor", JSON.stringify(matchedVendor));
                    showDashboard();
                } else {
                    userIdError.textContent = "Invalid credentials. Please try again.";
                    vendorsCodeError.textContent = "";
                }
            })
            .catch(error => {
                console.error("Error fetching vendor data:", error);
                userIdError.textContent = "Error fetching data. Try again later.";
            });
    });

    function showDashboard() {
        // Hide inputs and button
        userIdInput.style.display = "none";
        vendorsCodeInput.style.display = "none";
        loginBtn.style.display = "none";
        addShopBtn.style.display = "none";
        userIdError.textContent = "";
        vendorsCodeError.textContent = "";        document.querySelector("p").style.display = "none";
document.querySelector("h1").style.display = "none";        

        // Show the vendor dashboard
        vendorDashboard.style.display = "block";
    }
});

//---------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    let jsonData = [];

    // Fetch data on page load
    fetch("https://dust-fantasy-pail.glitch.me/data")
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Fetched data is not an array.");
                return;
            }
            jsonData = data; // Store the fetched data

            // Check localStorage for saved values
            const savedUserId = localStorage.getItem("userId");
            const savedVendorCode = localStorage.getItem("vendorCode");

            if (savedUserId && savedVendorCode) {
                // Automatically populate and show details if a valid match is found
                const matchedRow = jsonData.find(row => row.affiliateEmail === savedUserId && row.refCode === savedVendorCode);
                if (matchedRow) {
                    updateDetails(matchedRow);
                }
            }
        })
        .catch(error => console.error("Error fetching data:", error));

    // Handle login button click
    document.getElementById("loginBtn").addEventListener("click", function () {
        const userId = document.getElementById("userId").value.trim();
        const vendorCode = document.getElementById("vendorsCode").value.trim();

        const userIdError = document.getElementById("userIdError");
        const vendorCodeError = document.getElementById("vendorsCodeError");

        // Clear previous error messages
        userIdError.textContent = "";
        vendorCodeError.textContent = "";

        // Validate inputs
        if (!userId) {
            userIdError.textContent = "Please enter a User ID.";
            return;
        }
        if (!vendorCode) {
            vendorCodeError.textContent = "Please enter a REFF-Code.";
            return;
        }

        // Save values to localStorage for persistence across page refresh
        localStorage.setItem("userId", userId);
        localStorage.setItem("vendorCode", vendorCode);

        // Find the matching row
        const matchedRow = jsonData.find(row => row.affiliateEmail === userId && row.refCode === vendorCode);

        if (matchedRow) {
            // Replace text content with the matched data
            updateDetails(matchedRow);
            showDashboard(); // Show the dashboard after updating details
        } else {
            userIdError.textContent = "Invalid User ID or Vendor Code.";
        }
    });

    // Function to update the details on the page
    function updateDetails(matchedRow) {
    // Update dashboard fields with matched data
    document.getElementById("dashboard-firstName").textContent = matchedRow.firstName || "N/A";
    document.getElementById("dashboard-storeName").textContent = matchedRow.storeName || "N/A";
    document.getElementById("dashboard-storesAddress").textContent = matchedRow.storesAddress || "N/A";
    document.getElementById("dashboard-contact").textContent = matchedRow.contact || "N/A";

    // Payment Details (default to "N/A" if missing)
    document.getElementById("dashboard-totalSales").textContent = matchedRow.totalSales || "N/A";
    document.getElementById("dashboard-totalPayment").textContent = matchedRow.totalPayment || "N/A";
    document.getElementById("dashboard-lastPaymentDate").textContent = matchedRow.lastPaymentDate || "N/A";
    document.getElementById("dashboard-lastPaidAmount").textContent = matchedRow.lastPaidAmount || "N/A";
    document.getElementById("dashboard-nextPaymentDate").textContent = matchedRow.nextPaymentDate || "N/A";
    document.getElementById("dashboard-amountToBePaid").textContent = matchedRow.amountToBePaid || "N/A";
}
    // Function to show the vendor dashboard
    function showDashboard() {
        // Hide inputs and button
        document.getElementById("userId").style.display = "none";
        document.getElementById("vendorsCode").style.display = "none";
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("addShopBtn").style.display = "none";
        document.getElementById("userIdError").textContent = "";
        document.getElementById("vendorsCodeError").textContent = "";

        // Show the vendor dashboard
        document.getElementById("vendorDashboard").style.display = "block";
    }
});
//---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {
        // Clear the logged-in vendor data from localStorage
        localStorage.removeItem("loggedInVendor");

        // Hide the vendor dashboard
        document.getElementById("vendorDashboard").style.display = "none";

        // Show the login container
        document.getElementById("loginContainer").style.display = "block";

        // Clear the input fields
        document.getElementById("userId").value = "";
        document.getElementById("vendorsCode").value = "";

        // Refresh the page
        location.reload();
    });
});
//---------------------------------------
function showSuccessPopup() {
    const popup = document.getElementById("successPopup");
    popup.style.display = "flex"; // Show the popup

    document.getElementById("okButton").addEventListener("click", function () {
        popup.style.display = "none"; // Hide popup
        document.getElementById("vendorForm").style.display = "none"; // Hide form
        document.getElementById("loginContainer").style.display = "block"; // Show login container
    });
}
