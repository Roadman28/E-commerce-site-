document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const categoryCarousel = document.querySelector(".categories-carousel");
    const categoryCards = document.querySelectorAll(".category-card");
    const showAllButton = document.getElementById("show-all");
    const cartCounter = document.querySelector(".cart-counter");
    const cartDropdown = document.querySelector(".cart-dropdown");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.createElement("div");
    cartTotal.classList.add("cart-total");

    // Create Checkout and Clear Cart Buttons
    const checkoutButton = document.createElement("button");
    const clearCartButton = document.createElement("button");

    checkoutButton.textContent = "Checkout";
    clearCartButton.textContent = "Clear";

    checkoutButton.classList.add("cart-btn", "checkout-btn");
    clearCartButton.classList.add("cart-btn", "clear-cart-btn");

    // Add Buttons to Cart Actions
    const cartActions = document.createElement("div");
    cartActions.classList.add("cart-actions");
    cartActions.appendChild(cartTotal);
    cartActions.appendChild(checkoutButton);
    cartActions.appendChild(clearCartButton);
    cartDropdown.appendChild(cartActions);

    // Global Variables
    let cartCount = 0;
    let cartItems = [];

    // Add to Cart Functionality
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".product-card");
            const productId = productCard.id + "-" + productCard.querySelector("h3").innerText.toLowerCase().replace(/\s+/g, "-");
            const productName = productCard.querySelector("h3").innerText;
            const productPrice = parseFloat(productCard.querySelector(".price").innerText.replace("$", ""));
            const productImage = productCard.querySelector("img").src;
            const quantity = parseInt(productCard.querySelector("input").value);

            // Check if the product already exists in the cart
            const existingItem = cartItems.find((item) => item.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity; // Update quantity if it exists
            } else {
                cartItems.push({ // Add new item to cart
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity,
                });
            }

            // Update the cart count and dropdown
            updateCartCount();
            updateCartDropdown();
        });
    });

    // Update Cart Count
    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    // Update Cart Dropdown
    function updateCartDropdown() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cartItems.forEach((item) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        // Update the total
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-id");
                removeItemFromCart(itemId);
                cartDropdown.classList.add("show"); // Keep cart dropdown open after removal
            });
        });
    }

    // Remove Item from Cart
    function removeItemFromCart(itemId) {
        const itemIndex = cartItems.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
            const removedItem = cartItems.splice(itemIndex, 1)[0];
            cartCount -= removedItem.quantity; // Update the cart count
            cartCounter.textContent = cartCount;
            updateCartDropdown();
        }
    }

    // Clear Cart Function
    clearCartButton.addEventListener("click", function () {
        cartItems = [];
        cartCount = 0;
        cartCounter.textContent = "0";
        updateCartDropdown();
    });

    // Checkout Functionality
    checkoutButton.addEventListener("click", function () {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Calculate subtotal, taxes, and total
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxRate = 0.15; // 15% tax
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Create an invoice object
        const invoice = {
            date: new Date().toLocaleString(),
            items: [...cartItems], // Copy of cart items
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: "Completed", // Mark the order as completed
        };

        // Save invoices to sessionStorage
        let invoices = JSON.parse(sessionStorage.getItem("invoices")) || [];
        invoices.push(invoice);
        sessionStorage.setItem("invoices", JSON.stringify(invoices));

        // Clear the cart
        cartItems = [];
        updateCartCount();
        updateCartDropdown();

        // Redirect to invoice.html
        window.location.href = "invoice.html";
    });

    // Toggle Cart Dropdown
    document.querySelector(".cart").addEventListener("click", function (event) {
        event.preventDefault();
        cartDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside, except when removing an item
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".cart") && !event.target.closest(".cart-dropdown") && !event.target.classList.contains("remove-item")) {
            cartDropdown.classList.remove("show");
        }
    });

    // Filter products by console name
    function filterProductsByConsole(consoleName) {
        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach((card) => {
            const productName = card.querySelector("h3").innerText.toLowerCase();
            if (productName.includes(consoleName.toLowerCase())) {
                card.style.display = "block"; // Show matching products
            } else {
                card.style.display = "none"; // Hide non-matching products
            }
        });
    }

    // Show all products
    function showAllProducts() {
        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach((card) => {
            card.style.display = "block"; // Show all products
        });
    }

    // Keep selected category highlighted and filter products
    categoryCards.forEach((card) => {
        card.addEventListener("click", function () {
            const consoleName = this.querySelector("h3").innerText; // Get the console name from the category card
            categoryCards.forEach((c) => c.classList.remove("selected"));
            this.classList.add("selected");
            filterProductsByConsole(consoleName);
        });
    });

    // Remove highlight and show all products when "Show All" is clicked
    showAllButton.addEventListener("click", function () {
        categoryCards.forEach((card) => card.classList.remove("selected"));
        showAllProducts();
    });
});

// Scroll Carousel Function
function scrollCarousel(direction) {
    const carousel = document.querySelector(".categories-carousel");
    const scrollAmount = 200; // Adjust this value to control the scroll amount

    if (direction === -1) {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Modal Functionality
const modal = document.getElementById("about-me-modal");
const aboutMeLink = document.getElementById("about-me-link");
const closeBtn = document.querySelector(".close");

// Open Modal
aboutMeLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "block";
});

// Close Modal
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Close Modal when clicking outside
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});