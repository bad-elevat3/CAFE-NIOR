// Global cart array
let cart = [];
let currentProduct = {};

// Navigate between screens
function goTo(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }

  // Update nav buttons
  updateNavButtons(screenId);
}

// Update active nav button
function updateNavButtons(screenId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));

  // Map screen IDs to nav button indices
  const screenToNav = {
    'screen-home': 0,
    'screen-menu': 1,
    'screen-cart': 2,
    'screen-login': 3
  };

  const index = screenToNav[screenId];
  if (index !== undefined) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons[index]?.classList.add('active');
  }
}

// Show product details
function showProduct(name, image, price, description) {
  currentProduct = {
    name: name,
    image: image,
    price: price,
    description: description,
    size: 'Small'
  };

  document.getElementById('product-name').textContent = name;
  document.getElementById('product-desc').textContent = description;
  document.getElementById('product-img').src = image;

  goTo('screen-product');
}

// Add to cart
function addToCart() {
  if (!currentProduct.name) return;

  const cartItem = {
    id: Math.random(),
    name: currentProduct.name,
    image: currentProduct.image,
    price: parseFloat(currentProduct.price.replace('$', '')), 
    size: document.querySelector('.price-pill.selected')?.textContent || 'Small',
    quantity: 1
  };

  // Check if item already in cart
  const existingItem = cart.find(item => item.name === cartItem.name && item.size === cartItem.size);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(cartItem);
  }

  updateCart();
  goTo('screen-cart');
}

// Update cart display
function updateCart() {
  const cartList = document.getElementById('cart-list');

  if (cart.length === 0) {
    cartList.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
    updateCartTotals();
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">${item.size}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <div class="qty-num">${item.quantity}</div>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      <button class="qty-btn" onclick="removeFromCart(${item.id})" style="background: rgba(224, 85, 85, 0.2); color: #e05555; position: absolute; top: 10px; right: 10px;">×</button>
    </div>
  `).join('');

  updateCartTotals();
}

// Update quantity
function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCart();
    }
  }
}

// Remove from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
}

// Clear cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    updateCart();
  }
}

// Update cart totals
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('tax').textContent = '$' + tax.toFixed(2);
  document.getElementById('total').textContent = '$' + total.toFixed(2);
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  alert('Thank you for your order! Total: $' + 
    (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08).toFixed(2));
  
  cart = [];
  updateCart();
  goTo('screen-home');
}

// Select size pills
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('price-pill')) {
      document.querySelectorAll('.price-pill').forEach(pill => {
        pill.classList.remove('selected');
      });
      e.target.classList.add('selected');
    }
  });
});
