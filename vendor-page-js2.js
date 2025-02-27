//------------------------------------------- 
      
document.addEventListener("DOMContentLoaded", function () {
    const socket = io("https://dust-fantasy-pail.glitch.me");

    let refCodeValidated = false;
    let locationReceived = false;

    // Validate RefCode
    document.getElementById("validate").addEventListener("click", function () {
        const refCode = document.getElementById("refCode").value.trim();
        const refCodeError = document.getElementById("refCodeError");
        const reffCodeMsg = document.getElementById("reffCodeMsg");

        if (!refCode) {
            refCodeError.innerText = "Referrer Code is required.";
            reffCodeMsg.innerText = "";
            refCodeValidated = false;
            return;
        }

        refCodeError.innerText = ""; // Clear previous error

        fetch("https://dust-fantasy-pail.glitch.me/data")
            .then(response => response.json())
            .then(data => {
                const isValid = data.some(user => user.refCode === refCode);
                if (isValid) {
                    reffCodeMsg.innerText = "Validated";
                    reffCodeMsg.style.color = "green";
                    refCodeValidated = true;
                } else {
                    reffCodeMsg.innerText = "REFF Code not matched";
                    reffCodeMsg.style.color = "red";
                    refCodeValidated = false;
                }
            })
            .catch(error => {
                console.error("Error fetching refCode data:", error);
                reffCodeMsg.innerText = "Error checking REFF Code.";
                reffCodeMsg.style.color = "red";
                refCodeValidated = false;
            });
    });

    // Get Location
    document.getElementById("getLocationButton").addEventListener("click", function () {
        const storeName = document.getElementById("storeName").value.trim();
        const storeCategory = document.getElementById("storeCategory").value.trim();
        const locationError = document.getElementById("locationError");

        if (!storeName) {
            locationError.innerText = "Store Name is required.";
            return;
        }
        if (!storeCategory) {
            locationError.innerText = "Store Category is required.";
            return;
        }

        locationError.innerText = ""; // Clear previous errors

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locationData = `"${storeName}": { lat: ${lat}, lng: ${lng}, categories: ["${storeCategory}"] }`;
                    document.getElementById("location").value = locationData;
                    locationError.innerText = "Location received";
                    locationError.style.color = "green";
                    locationReceived = true;
                },
                function () {
                    locationError.innerText = "Failed to get location. Please enable GPS.";
                    locationError.style.color = "red";
                    locationReceived = false;
                }
            );
        } else {
            locationError.innerText = "Geolocation is not supported in this browser.";
            locationError.style.color = "red";
            locationReceived = false;
        }
    });

    // Validate Email
    function validateEmail() {
        const email = document.getElementById("email").value.trim();
        const emailError = document.getElementById("emailError");
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            emailError.innerText = "Email is required.";
            return false;
        } else if (!regex.test(email)) {
            emailError.innerText = "Invalid email format.";
            return false;
        } else {
            emailError.innerText = "";
            return true;
        }
    }

    // Validate Contact
    function validateContact() {
        const contact = document.getElementById("contact").value.trim();
        const contactError = document.getElementById("contactError");

        if (!contact) {
            contactError.innerText = "Contact Number is required.";
            return false;
        } else if (contact.length < 8 || contact.length > 15) {
            contactError.innerText = "Invalid contact number.";
            return false;
        } else {
            contactError.innerText = "";
            return true;
        }
    }

    // Validate Input Fields
    function validateInput(id, errorId, message) {
        const input = document.getElementById(id).value.trim();
        const errorElement = document.getElementById(errorId);

        if (!input) {
            errorElement.innerText = message;
            return false;
        } else {
            errorElement.innerText = "";
            return true;
        }
    }

    // Submit Form
    async function submitUser() {
    const isValid = [
        validateInput("firstName", "firstNameError", "First Name is required."),
        validateInput("lastName", "lastNameError", "Last Name is required."),
        validateInput("storeName", "storeNameError", "Store Name is required."),
        validateInput("storeCategory", "storeCategoryError", "Store Category is required."),
        validateInput("storesAddress ", "storesAddress Error", "Store Address is required."),
        validateEmail(), 
        validateContact(),                      
        validateInput("vendorCode", "vendorCodeError", "Vendor Code is required.")
    ];

    const message = document.getElementById("message");

    if (isValid.includes(false)) {
        message.innerHTML = "<span style='color: red;'>Please correct the errors above.</span>";
        return;
    }

    if (!refCodeValidated) {
        document.getElementById("refCodeError").innerText = "Referrer Code must be validated.";
        return;
    }

    if (!locationReceived) {
        document.getElementById("locationError").innerText = "Location must be received.";
        return;
    }

    const refCode = document.getElementById("refCode").value.trim();
    let affiliateEmail = "";

    try {
        // Fetch JSON data for refCode validation
        const response = await fetch('https://dust-fantasy-pail.glitch.me/data');
        const jsonData = await response.json();

        // Find affiliateEmail by matching refCode
        const matchedData = jsonData.find(entry => entry.refCode === refCode);
        if (matchedData) {
            affiliateEmail = matchedData.affiliateEmail || "";
        }

        // Prepare user data for both socket and backend submission
        const userData = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            refCode: refCode,
            storeName: document.getElementById("storeName").value.trim(),
            storeCategory: document.getElementById("storeCategory").value.trim(),
            storesAddress : document.getElementById("storesAddress").value.trim(),
            location: document.getElementById("location").value.trim(),
            email: document.getElementById("email").value.trim(),
            contact: document.getElementById("contact").value.trim(),
            vendorCode: document.getElementById("vendorCode").value.trim(),
            affiliateEmail: affiliateEmail
        };

        // Send data to socket
        socket.emit("submitUser", userData);

        // Send data to backend
        const sendResponse = await fetch('https://bronzed-carpal-zone.glitch.me/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        // Reset form and display message
        document.getElementById("vendorForm").reset();
        refCodeValidated = false;
        locationReceived = false;
        document.getElementById("reffCodeMsg").innerText = "";
        document.getElementById("locationError").innerText = "";

        if (sendResponse.ok) {
            message.innerHTML = "<span style='color: green;'>User details submitted successfully!</span>";
            showSuccessPopup();
        } else {
            message.innerHTML = "<span style='color: red;'>Submission failed. Please try again.</span>";
        }
    } catch (error) {
        message.innerHTML = "<span style='color: red;'>An error occurred. Please try again.</span>";
    }
}

// Attach event listener to the submit button
document.querySelector("button[onclick='submitUser()']").addEventListener("click", submitUser);
});
