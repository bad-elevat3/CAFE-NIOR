// Merged and unified cart system

class Cart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    clearCart() {
        this.items = [];
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    checkout() {
        // Placeholder for checkout logic
    }

    listItems() {
        return this.items;
    }
}

// Example usage
const cart = new Cart();
cart.addItem({ id: 1, name: 'Product 1', price: 10.00, quantity: 1 });
cart.addItem({ id: 2, name: 'Product 2', price: 15.00, quantity: 1 });
console.log(cart.listItems());
console.log('Total:', cart.getTotal());