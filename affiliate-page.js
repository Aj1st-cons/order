document.addEventListener("DOMContentLoaded", function () {  
    const addShopButton = document.getElementById("addShopBtn");  
    const loginContainer = document.getElementById("loginContainer");
    const vendorForm = document.getElementById("vendorForm");
    const userIdInput = document.getElementById("userId");
    const vendorsCodeInput = document.getElementById("vendorsCode");
    const loginBtn = document.getElementById("loginBtn");
    const userIdError = document.getElementById("userIdError");
    const vendorsCodeError = document.getElementById("vendorsCodeError");
    const vendorDashboard = document.getElementById("vendorDashboard");
    const logoutBtn = document.getElementById("logoutBtn");
    const dashboardAffiliateName = document.getElementById("dashboard-affiliateName");
    const paymentTableHead = document.getElementById("paymentTableHead");
    const paymentTableBody = document.getElementById("paymentTableBody");
    const closeVendorForm = document.getElementById("closeVendorForm");

    let jsonData = [];
    
    // Event listener for opening the vendor form
    addShopButton.addEventListener("click", function () {
        loginContainer.style.display = "none";
        vendorForm.style.display = "block";
    });

    // Event listener for closing the vendor form
    closeVendorForm.addEventListener("click", function () {
        vendorForm.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Check if user is already logged in        
    const savedUser = JSON.parse(localStorage.getItem("loggedInVendor"));
    if (savedUser) {
        showDashboard(savedUser);
    }

    // Login button event listener
    loginBtn?.addEventListener("click", function () {
        const enteredEmail = userIdInput.value.trim();
        const enteredVendorCode = vendorsCodeInput.value.trim();

        // Validate input fields
        if (!enteredEmail || !enteredVendorCode) {
            userIdError.textContent = enteredEmail ? "" : "User ID is required.";
            vendorsCodeError.textContent = enteredVendorCode ? "" : "REFF-Code is required.";
            return;
        }

        // Fetch JSON data
        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then((response) => response.json())
            .then((data) => {
                if (!Array.isArray(data)) {
                    console.error("Error: JSON data is not an array.");
                    userIdError.textContent = "Data error. Try again later.";
                    return;
                }
                jsonData = data;

                // Filter vendors with valid properties before accessing them
                const matchedVendors = data.filter(
                    (vendor) =>
                        vendor.affiliateEmail && vendor.refCode && // Ensure both exist
                        vendor.affiliateEmail.trim().toLowerCase() === enteredEmail.toLowerCase() &&
                        vendor.refCode.trim() === enteredVendorCode
                );

                if (matchedVendors.length > 0) {
                    const validVendor = matchedVendors.find(
                        (vendor) => vendor.affiliateName && vendor.affiliateName !== "N/A"
                    ) || matchedVendors[0];

                    // Save vendor details in localStorage
                    localStorage.setItem("loggedInVendor", JSON.stringify(validVendor));
                    showDashboard(validVendor);
                } else {
                    userIdError.textContent = "Invalid credentials. Please try again.";
                    vendorsCodeError.textContent = "";
                }
            })
            .catch((error) => {
                console.error("Error fetching vendor data:", error);
                userIdError.textContent = "Error fetching data. Try again later.";
            });
    });

    // Function to show dashboard with vendor details
    function showDashboard(vendor) {
        if (vendor && vendor.affiliateName && vendor.affiliateName !== "N/A") {
            dashboardAffiliateName.textContent = ` ${vendor.affiliateName},`;
        } else {
            dashboardAffiliateName.textContent = " User,";
        }

        // Hide login and show dashboard
        loginContainer.style.display = "none";
        vendorDashboard.style.display = "block";
        vendorForm.style.display = "none";

        // Update payment details table
        updateDetails(vendor);
    }

    // Function to update payment details
    function updateDetails(matchedRow) {
        // Clear existing headers and rows
        paymentTableHead.innerHTML = "";
        paymentTableBody.innerHTML = "";

        // Fetch JSON data again
        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("Fetched data is not an array.");
                    return;
                }

                // Filter rows based on matched user's email and refCode
                const filteredRows = data.filter(row =>
                    row.affiliateEmail === matchedRow.affiliateEmail && row.refCode === matchedRow.refCode
                );

                if (filteredRows.length === 0) {
                    const noDataRow = document.createElement("tr");
                    noDataRow.innerHTML = `<td colspan="100%" style="text-align: center;">No payment details found.</td>`;
                    paymentTableBody.appendChild(noDataRow);
                    return;
                }

                // Dynamically generate table headers
                const headers = Object.keys(filteredRows[0]);
                const headerRow = document.createElement("tr");
                headers.forEach(header => {
                    const th = document.createElement("th");
                    th.textContent = header.replace(/([A-Z])/g, " $1").trim(); // Format camelCase to readable text
                    headerRow.appendChild(th);
                });
                paymentTableHead.appendChild(headerRow);

                // Add filtered rows to the table body
                filteredRows.forEach(row => {
                    const rowElement = document.createElement("tr");
                    headers.forEach(header => {
                        const td = document.createElement("td");
                        td.textContent = row[header] || "N/A"; // Display "N/A" if value is missing
                        rowElement.appendChild(td);
                    });
                    paymentTableBody.appendChild(rowElement);
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    // Logout functionality
    logoutBtn?.addEventListener("click", function () {
        localStorage.removeItem("loggedInVendor");
        vendorDashboard.style.display = "none";
        loginContainer.style.display = "block";
        userIdInput.value = "";
        vendorsCodeInput.value = "";
        location.reload();
    });
});
//----------------------------------------

// Generate Random Code
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

//----------------------------------------

// Validate Email
function validateEmail() {
    const affiliateEmail = document.getElementById("affiliateEmail").value.trim();
    const affiliateEmailError = document.getElementById("affiliateEmailError");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!affiliateEmail) {
        affiliateEmailError.innerText = "Email is required.";
        return false;
    } else if (!regex.test(affiliateEmail)) {
        affiliateEmailError.innerText = "Invalid email format.";
        return false;
    } else {
        affiliateEmailError.innerText = "";
        return true;
    }
}

//----------------------------------------

function showSuccessPopup() {
    const popup = document.getElementById("successPopup");
    popup.style.display = "flex"; // Show the popup

    document.getElementById("okButton").addEventListener("click", function () {
        popup.style.display = "none"; // Hide popup
        document.getElementById("vendorForm").style.display = "none"; // Hide form
        document.getElementById("loginContainer").style.display = "block"; // Show login container
    });
}

//----------------------------------------

// Submit Form
async function submitUser() {
    // Run email validation
    const isValid = validateEmail();

    if (!isValid) {
        return; // Stop submission if validation fails
    }

    const message = document.getElementById("message");

    // Generate and fill refCode input
    const refCode = generateRandomCode();
    //Remove this since the field is hidden document.getElementById("refCode").value = refCode;

    // Disable the submit button and change its text
    const submitButton = document.querySelector("button[type='button']");
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";

    try {
        // Prepare user data for socket submission (all fields, even if not filled)
        const userDataForSocket = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            refCode: refCode,
            storeName: document.getElementById("storeName").value.trim(),
            storeCategory: document.getElementById("storeCategory").value.trim(),
            storesAddress: document.getElementById("storesAddress").value.trim(),
            location: document.getElementById("location").value.trim(),
            email: document.getElementById("email").value.trim(),
            contact: document.getElementById("contact").value.trim(),
            vendorCode: document.getElementById("vendorCode").value.trim(),
            affiliateName: document.getElementById("affiliateName").value.trim(),
            affiliateEmail: document.getElementById("affiliateEmail").value.trim(),
            platform: document.getElementById("platform").value.trim(),
        };

        // Send data to socket
        const socket = io("https://dust-fantasy-pail.glitch.me");
        socket.emit("submitUser", userDataForSocket);

        // Prepare user data for backend submission (only required fields)
        const userDataForBackend = {
            affiliateEmail: userDataForSocket.affiliateEmail,
            refCode: refCode,
        };

        // Send data to backend
        const sendResponse = await fetch('https://scintillating-oxidized-volcano.glitch.me/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDataForBackend),
        });

        // Reset form and display message
        if (sendResponse.ok) {
            message.innerHTML = "<span style='color: green;'>User details submitted successfully! Check your email for login information.</span>";
            showSuccessPopup(); // Assuming this function is already defined
        } else {
            const errorData = await sendResponse.json();
            message.innerHTML = `<span style='color: red;'>Submission failed: ${errorData.message}</span>`;
        }
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        message.innerHTML = "<span style='color: red;'>An error occurred. Please try again.</span>";
    } finally {
        // Re-enable the submit button and reset its text
        submitButton.disabled = false;
        submitButton.innerText = "Submit";
    }
    }
