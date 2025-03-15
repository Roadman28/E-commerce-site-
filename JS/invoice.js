document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const invoiceContainer = document.querySelector(".invoice-container");
    const cancelOrderButton = document.getElementById("cancel-order");

    // Retrieve the latest invoice from sessionStorage
    let invoices = JSON.parse(sessionStorage.getItem("invoices")) || [];
    const latestInvoice = invoices[invoices.length - 1];

    // Display the invoice details
    if (latestInvoice) {
        invoiceContainer.innerHTML = `
            <h2>Invoice</h2>
            <p><strong>Date:</strong> ${latestInvoice.date}</p>
            <h3>Items:</h3>
            <ul>
                ${latestInvoice.items.map(item => `
                    <li>
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
                    </li>
                `).join("")}
            </ul>
            <p><strong>Subtotal:</strong> $${latestInvoice.subtotal.toFixed(2)}</p>
            <p><strong>Tax (15%):</strong> $${latestInvoice.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> $${latestInvoice.total.toFixed(2)}</p>
        `;
    } else {
        invoiceContainer.innerHTML = "<p>No invoice found.</p>";
    }

    // Cancel Order Functionality
    if (cancelOrderButton) {
        cancelOrderButton.addEventListener("click", function () {
            if (latestInvoice) {
                // Mark the latest invoice as "Cancelled"
                latestInvoice.status = "Cancelled";

                // Update the invoice in sessionStorage
                invoices[invoices.length - 1] = latestInvoice;
                sessionStorage.setItem("invoices", JSON.stringify(invoices));

                // Clear the invoice UI
                invoiceContainer.innerHTML = "<p>Your order has been cancelled.</p>";

                // Optionally, redirect the user back to the products page
                setTimeout(() => {
                    window.location.href = "https://roadman28.github.io/E-commerce-site-/Codes/products.html";
                }, 2000); // Redirect after 2 seconds
            } else {
                alert("No order to cancel.");
            }
        });
    }
});
