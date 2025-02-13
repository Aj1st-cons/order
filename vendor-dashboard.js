$(document).ready(function () {
    const API_URL = "https://bitter-spotted-muscle.glitch.me"; // Replace with your Glitch URL

    // Login function
    $("#login-btn").click(function () {
        const email = $("#email").val().trim();
        if (!email) {
            $("#response-message").html('<p style="color: red;">Please enter a valid email.</p>');
            return;
        }

        $.ajax({
            url: API_URL + "/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: email }),
            success: function (response) {
                if (response.success) {
                    $("#login-section").hide();
                    $("#product-section").show();
                    $("#response-message").html('<p>Login successful. Welcome!</p>');
                } else {
                    $("#response-message").html('<p style="color: red;">' + response.message + '</p>');
                }
            },
            error: function () {
                $("#response-message").html('<p style="color: red;">Login failed. Check server.</p>');
            }
        });
    });

    // Add product function
    $("#add-product-btn").click(function () {
        const title = $("#product-title").val().trim();
        const description = $("#product-description").val().trim();

        if (!title || !description) {
            $("#response-message").html('<p style="color: red;">All fields are required.</p>');
            return;
        }

        $.ajax({
            url: API_URL + "/add-product",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ title, description }),
            success: function (response) {
                if (response.success) {
                    $("#response-message").html('<p>Product added successfully!</p>');
                    $("#product-title").val("");
                    $("#product-description").val("");
                } else {
                    $("#response-message").html('<p style="color: red;">' + response.message + '</p>');
                }
            },
            error: function () {
                $("#response-message").html('<p style="color: red;">Error adding product.</p>');
            }
        });
    });

    // Logout function
    $("#logout-btn").click(function () {
        $("#login-section").show();
        $("#product-section").hide();
        $("#response-message").html('<p>You have logged out.</p>');
    });
});








//frontend to send email

$(document).ready(function () {
    const API_URL = "https://bitter-spotted-muscle.glitch.me"; // Replace with your Glitch URL

    // Function to send email notification
    function sendEmailNotification(toEmail, subject, body) {
        $.ajax({
            url: API_URL + "/send-email",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ toEmail, subject, body }),
            success: function (response) {
                if (response.success) {
                    console.log("Email sent successfully!");
                } else {
                    console.error("Error sending email:", response.message);
                }
            },
            error: function () {
                console.error("Failed to send email.");
            }
        });
    }

    // Add product function with email trigger
    $("#add-product-btn").click(function () {
        const title = $("#product-title").val().trim();
        const description = $("#product-description").val().trim();

        if (!title || !description) {
            $("#response-message").html('<p style="color: red;">All fields are required.</p>');
            return;
        }

        $.ajax({
            url: API_URL + "/add-product",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ title, description }),
            success: function (response) {
                if (response.success) {
                    $("#response-message").html('<p>Product added successfully!</p>');
                    $("#product-title").val("");
                    $("#product-description").val("");

                    // Trigger email notification
                    sendEmailNotification(
                        "vendor@example.com", // Replace with vendor's email
                        "New Product Added",
                        `Your product "${title}" has been added successfully!`
                    );
                } else {
                    $("#response-message").html('<p style="color: red;">' + response.message + '</p>');
                }
            },
            error: function () {
                $("#response-message").html('<p style="color: red;">Error adding product.</p>');
            }
        });
    });
});













    const shopifyStore = "order-app-ae.myshopify.com";
const clientId = "YOUR_SHOPIFY_CLIENT_ID"; // Replace with your Shopify app's client ID

// Step 1: Redirect Vendor to Shopify OAuth
function loginWithShopify() {
    const redirectUri = encodeURIComponent(window.location.origin + "/pages/vendors");
    const shopifyAuthUrl = `https://${shopifyStore}/admin/oauth/authorize?client_id=${clientId}&scope=read_customers&redirect_uri=${redirectUri}`;
    window.location.href = shopifyAuthUrl;
}

// Step 2: Handle OAuth Callback
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
        try {
            // Exchange code for access token (backend needed here for security)
            // For now, simulate login success
            const vendorEmail = "vendor@example.com"; // Replace with real email after authentication

            // Check if the vendor is tagged as "Vendor"
            const isVendor = await checkVendorTag(vendorEmail);
            if (!isVendor) {
                alert("Access Denied: You are not registered as a vendor.");
                return;
            }

            // Step 3: Ask for Referral Code (if first-time login)
            let referralCode = localStorage.getItem("vendorReferralCode");
            if (!referralCode) {
                referralCode = prompt("Enter your referral code:");
                if (referralCode) {
                    await validateReferralCode(referralCode, vendorEmail);
                }
            }

            // Store login session
            localStorage.setItem("vendorLoggedIn", "true");
            document.getElementById("loginSection").style.display = "none";
            document.getElementById("dashboardSection").style.display = "block";

        } catch (error) {
            console.error("OAuth Error:", error);
        }
    }
}

// Step 4: Check if User is a Vendor
async function checkVendorTag(email) {
    // Simulate API call (Replace with real Shopify API request)
    const vendorList = ["vendor@example.com", "vendor2@example.com"]; // Replace with Shopify customer list
    return vendorList.includes(email);
}

// Step 5: Validate Referral Code
async function validateReferralCode(code, vendorEmail) {
    try {
        const response = await fetch("https://order-1ib.pages.dev/referrals.html");
        const referralList = await response.json();

        const referral = referralList.find(item => item.code === code);
        if (referral) {
            alert(`Referral code valid! Your referrer ${referral.email} will be notified.`);
            localStorage.setItem("vendorReferralCode", code);
            localStorage.setItem("referrerEmail", referral.email);
        } else {
            alert("Invalid referral code. Please try again.");
        }
    } catch (error) {
        console.error("Referral Code Error:", error);
    }
}

// Initialize OAuth Handling
document.addEventListener("DOMContentLoaded", handleOAuthCallback);









    // Part 2: Vendor Dashboard UI & Order Tracking

// Display Dashboard and Orders
function displayVendorDashboard() {
    // Retrieve vendor data (For now, simulate with dummy data)
    const orders = [
        { id: 1, customer: "John Doe", total: 100, status: "Pending" },
        { id: 2, customer: "Jane Smith", total: 200, status: "Fulfilled" }
    ];

    const commissionPerOrder = 1; // AED

    let orderHtml = "";
    orders.forEach(order => {
        orderHtml += `
            <div class="order-card">
                <p>Order ID: ${order.id}</p>
                <p>Customer: ${order.customer}</p>
                <p>Total: AED ${order.total}</p>
                <p>Status: ${order.status}</p>
                <button onclick="updateOrderStatus(${order.id}, 'Fulfilled')">Mark as Fulfilled</button>
                <button onclick="updateOrderStatus(${order.id}, 'Delivered')">Mark as Delivered</button>
            </div>
        `;
    });

    // Update Dashboard UI
    document.getElementById("orderList").innerHTML = orderHtml;

    // Display Commission
    let totalCommission = orders.length * commissionPerOrder;
    document.getElementById("commissionAmount").innerHTML = `Total Commission: AED ${totalCommission}`;
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
    // Update the status of the order (Simulate API call)
    console.log(`Order ID ${orderId} marked as: ${newStatus}`);

    // Update the order status in the UI
    const orderElement = document.querySelector(`.order-card p:nth-child(4)`);
    orderElement.innerHTML = `Status: ${newStatus}`;

    // Send Notification to Customer and Vendor
    sendOrderNotification(orderId, newStatus);
}

// Send Order Notification (Vendor + Referral Email)
function sendOrderNotification(orderId, status) {
    const vendorEmail = "vendor@example.com"; // Replace with logged-in vendor email
    const referrerEmail = localStorage.getItem("referrerEmail");

    // Simulate sending email notifications (Replace with actual email API)
    console.log(`Sending email to vendor: ${vendorEmail}`);
    if (referrerEmail) {
        console.log(`Sending email to referrer: ${referrerEmail}`);
    }

    // Example email content (this should be handled by an email service)
    const emailSubject = `Order #${orderId} - ${status}`;
    const emailBody = `The status of your order #${orderId} has been updated to: ${status}`;

    // Use your email service here (e.g., SendGrid, Mailgun, etc.)
    // Example (pseudo-code):
    // emailService.sendEmail(vendorEmail, emailSubject, emailBody);
    // if (referrerEmail) emailService.sendEmail(referrerEmail, emailSubject, emailBody);
}

// Initialize Vendor Dashboard
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("vendorLoggedIn") === "true") {
        displayVendorDashboard();
    }
});








// Part 3: Order Notifications (Vendor + Referral Email)

// Send Order Notification (Vendor + Referral Email)
function sendOrderNotification(orderId, status) {
    const vendorEmail = "vendor@example.com"; // Replace with the logged-in vendor's email
    const referrerEmail = localStorage.getItem("referrerEmail");

    // Example email content
    const emailSubject = `Order #${orderId} - Status Update: ${status}`;
    const emailBody = `The status of your order #${orderId} has been updated to: ${status}.`;

    // Simulate sending email (this should be replaced by your email service)
    console.log(`Sending email to vendor: ${vendorEmail}`);
    if (referrerEmail) {
        console.log(`Sending email to referrer: ${referrerEmail}`);
    }

    // Sending email logic (Replace with actual email API call)
    // You can use your email service like SendGrid or Mailgun here
    sendEmail(vendorEmail, emailSubject, emailBody);

    // If there's a referrer, send an email to them as well
    if (referrerEmail) {
        sendEmail(referrerEmail, emailSubject, emailBody);
    }
}

// Send email using your email service (Simulated function)
function sendEmail(toEmail, subject, body) {
    // Example pseudo-code (replace with real email service API)
    console.log(`Email sent to ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Here, you would integrate with an email API service like:
    // - SendGrid
    // - Mailgun
    // - SMTP
    // This would typically involve making an API call to send the email.
    //
    // Example (pseudo-code):
    // emailService.send({
    //   to: toEmail,
    //   subject: subject,
    //   body: body
    // });
}

// Initialize and send order notifications after order status update
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("vendorLoggedIn") === "true") {
        // Simulating an order status update (example)
        sendOrderNotification(1, "Fulfilled");
    }
});






