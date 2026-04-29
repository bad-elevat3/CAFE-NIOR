// Unified Cart System Code

// Function to add an item to the cart
function addToCart(item) {
    if (!this.cart) {
        this.cart = [];
    }
    this.cart.push(item);
    console.log(`${item.name} added to cart.`);
}

// Function to remove an item from the cart
function removeFromCart(item) {
    const index = this.cart.indexOf(item);
    if (index > -1) {
        this.cart.splice(index, 1);
        console.log(`${item.name} removed from cart.`);
    } else {
        console.log(`${item.name} not found in cart.`);
    }
}

// Function to display cart items
function displayCart() {
    if (this.cart && this.cart.length > 0) {
        console.log("Items in your cart:");
        this.cart.forEach(item => {
            console.log(`- ${item.name}`);
        });
    } else {
        console.log("Your cart is empty.");
    }
}

// Function to calculate total price
function calculateTotal() {
    if (!this.cart || this.cart.length === 0) return 0;
    return this.cart.reduce((total, item) => total + item.price, 0);
}