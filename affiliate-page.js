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
    const columnToggles = document.getElementById("columnToggles");

    // Elements to update dynamically
    const aTotalSales = document.getElementById("aTotalSales");
    const aTotalCommission = document.getElementById("aTotalCommission");
    const aTotalCommissionPaid = document.getElementById("aTotalCommissionPaid");
    const aLastPaidDate = document.getElementById("aLastPaidDate");
    const aBalanceToPay = document.getElementById("aBalanceToPay");
    const aNextPaymentDate = document.getElementById("aNextPaymentDate");

    let jsonData = [];

    addShopButton?.addEventListener("click", function () {
        loginContainer.style.display = "none";
        vendorForm.style.display = "block";
    });

    closeVendorForm?.addEventListener("click", function () {
        vendorForm.style.display = "none";
        loginContainer.style.display = "block";
    });

    const savedUser = JSON.parse(localStorage.getItem("loggedInVendor"));
    if (savedUser) {
        showDashboard(savedUser);
        updateDashboardValues(savedUser); // Update the dashboard values when the page loads
    }

    loginBtn?.addEventListener("click", function () {
        const enteredEmail = userIdInput.value.trim().toLowerCase();
        const enteredVendorCode = vendorsCodeInput.value.trim();

        userIdError.textContent = enteredEmail ? "" : "User ID is required.";
        vendorsCodeError.textContent = enteredVendorCode ? "" : "REFF-Code is required.";
        if (!enteredEmail || !enteredVendorCode) return;

        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error("Invalid data format");

                jsonData = data;
                const matchedVendors = data.filter(vendor =>
                    vendor.affiliateEmail?.trim().toLowerCase() === enteredEmail &&
                    vendor.refCode?.trim() === enteredVendorCode
                );

                if (matchedVendors.length > 0) {
                    const validVendor = matchedVendors.find(vendor => vendor.affiliateName && vendor.affiliateName !== "N/A") || matchedVendors[0];

                    localStorage.setItem("loggedInVendor", JSON.stringify(validVendor));
                    showDashboard(validVendor);
                    updateDashboardValues(validVendor); // Update the dashboard values after login
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

    function showDashboard(vendor) {
        dashboardAffiliateName.textContent = vendor.affiliateName && vendor.affiliateName !== "N/A" ? ` ${vendor.affiliateName},` : " User,";

        loginContainer.style.display = "none";
        vendorDashboard.style.display = "block";
        vendorForm.style.display = "none";

        updateDetails(vendor);
    }

    function updateDetails(matchedRow) {
        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error("Invalid data format");

                const filteredRows = data.filter(row =>
                    row.affiliateEmail === matchedRow.affiliateEmail &&
                    row.refCode === matchedRow.refCode
                );

                renderTable(filteredRows);
                updateDashboardValues(filteredRows[0]); // Update the HTML values
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function renderTable(filteredRows) {
        paymentTableHead.innerHTML = "";
        paymentTableBody.innerHTML = "";

        if (filteredRows.length === 0) {
            paymentTableBody.innerHTML = `<tr><td colspan="100%" style="text-align: center;">No payment details found.</td></tr>`;
            return;
        }

        const hiddenColumns = new Set(["firstName", "lastName", "location", "vendorCode", "affiliateName", "affiliateEmail", "platform", "aTotalSales", "aTotalCommission", "aTotalCommissionPaid", "aLastPaidDate", "aBalanceToPay", "aNextPaymentDate", "lastPaymentDate", "lastPaidAmount", "nextPaymentDate", "amountToBePaid"]);

        const headers = Object.keys(filteredRows[0]);
        const headerRow = document.createElement("tr");

        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header.replace(/([A-Z])/g, " $1").trim();
            th.dataset.headerId = header;
            headerRow.appendChild(th);
        });

        paymentTableHead.appendChild(headerRow);

        filteredRows.forEach(row => {
            const rowElement = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header] || "N/A";
                td.dataset.headerId = header;
                rowElement.appendChild(td);
            });
            paymentTableBody.appendChild(rowElement);
        });

        updateColumnVisibility(hiddenColumns);
        createColumnToggles(headers, hiddenColumns);
    }

    function updateColumnVisibility(hiddenColumns) {
        document.querySelectorAll("#paymentTableHead th, #paymentTableBody td").forEach(element => {
            element.style.display = hiddenColumns.has(element.dataset.headerId) ? "none" : "";
        });
    }

    function toggleColumnVisibility(event, hiddenColumns) {
        const column = event.target.value;
        if (event.target.checked) {
            hiddenColumns.delete(column);
        } else {
            hiddenColumns.add(column);
        }
        updateColumnVisibility(hiddenColumns);
    }

    function createColumnToggles(headers, hiddenColumns) {
        columnToggles.innerHTML = "";

        headers.forEach(header => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = header;
            checkbox.checked = !hiddenColumns.has(header);
            checkbox.addEventListener("change", (event) => toggleColumnVisibility(event, hiddenColumns));

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + header.replace(/([A-Z])/g, " $1").trim()));
            columnToggles.appendChild(label);
        });
    }

    function updateDashboardValues(vendor) {
        if (vendor) {
            aTotalSales.textContent = vendor.aTotalSales || "0";
            aTotalCommission.textContent = vendor.aTotalCommission || "0";
            aTotalCommissionPaid.textContent = vendor.aTotalCommissionPaid || "0";
            aLastPaidDate.textContent = vendor.aLastPaidDate || "N/A";
            aBalanceToPay.textContent = vendor.aBalanceToPay || "0";
            aNextPaymentDate.textContent = vendor.aNextPaymentDate || "N/A";
        }
    }

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

    // Disable the submit button and change its text
    const submitButton = document.querySelector("button[type='button']");
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";

    // Create and display the countdown timer
    const countdownElement = document.createElement("div");
    countdownElement.id = "countdown";
    countdownElement.style.color = "blue";
    countdownElement.style.fontWeight = "bold";
    countdownElement.style.marginTop = "10px";
    submitButton.parentNode.insertBefore(countdownElement, submitButton.nextSibling);

    let countdown = 30;
    countdownElement.textContent = `Please wait ${countdown} seconds...`;

    // Start the countdown timer
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = `Please wait ${countdown} seconds...`;

        if (countdown <= 0) {
            clearInterval(countdownInterval); // Stop the timer when it reaches 0
            countdownElement.textContent = ""; // Clear the countdown text
        }
    }, 1000);

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
            affiliateEmail: document.getElementById("affiliateEmail").value.trim(),
            affiliateName: document.getElementById("affiliateName").value.trim(),
            platform: document.getElementById("platform").value.trim(),                            
            
            totalSales: document.getElementById("totalSales").value.trim(),
            totalReceived: document.getElementById("totalReceived").value.trim(),
            balanceToReceive: document.getElementById("balanceToReceive").value.trim(),
            totalEarned: document.getElementById("totalEarned").value.trim(),
            paid: document.getElementById("paid").value.trim(),
            balance: document.getElementById("balance").value.trim(),  
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
        const sendResponse = await fetch('https://cord-rocky-preface.glitch.me/send-email', {
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

        // Stop the countdown timer and clear the text
        clearInterval(countdownInterval);
        countdownElement.textContent = "";
    }
}
//-------------------------------------- 
