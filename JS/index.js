const validUsername = "user@example.com";
const validPassword = "password123"; // Make sure the password is at least 8 characters
let loginAttempts = 0;

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === validUsername && password === validPassword) {
        loginAttempts = 0; // Reset login attempts on successful login
        window.location.href = "products.html"; // Redirect to products page immediately
    } else {
        loginAttempts++;
        alert("Invalid username or password. Attempt " + loginAttempts + " of 3.");

        if (loginAttempts >= 3) {
            window.location.href = "error.html"; // Redirect to error page after 3 failed attempts
        }
    }
});
