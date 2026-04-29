// ── Menu Data ──
const MENU_ITEMS = [
  { id: 1, name: 'Cappuccino',   price: 45, large: 70, img: 'assets/cappuccino.jpg', desc: 'Espresso with steamed milk and creamy foam' },
  { id: 2, name: 'Flat White',   price: 45, large: 70, img: 'assets/flat-white.jpg', desc: 'Smooth espresso with velvety microfoam' },
  { id: 3, name: 'Cold Brew',    price: 45, large: 70, img: 'assets/cold-brew.jpg', desc: 'Smooth cold-brewed coffee concentrate' },
  { id: 4, name: 'Pour Over',    price: 45, large: 70, img: 'assets/pour-over.jpg', desc: 'Hand-poured precision coffee' },
  { id: 5, name: 'Café Mocha',   price: 45, large: 70, img: 'assets/cafe-mocha.jpg', desc: 'Espresso, steamed milk, and rich chocolate' },
];

let cart = [];
let currentProduct = {};

function goTo(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  updateNavButtons(screenId);
  if (screenId === 'screen-cart') renderCart();
}

function updateNavButtons(screenId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));
  
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

function showProduct(menuItem) {
  currentProduct = {
    id: menuItem.id,
    name: menuItem.name,
    image: menuItem.img,
    price: menuItem.price,
    largePrice: menuItem.large,
    description: menuItem.desc,
    size: 'Small'
  };
  
  document.getElementById('product-name').textContent = menuItem.name;
  document.getElementById('product-desc').textContent = menuItem.desc;
  document.getElementById('product-img').src = menuItem.img;
  
  goTo('screen-product');
}

function addToCart() {
  if (!currentProduct.name) return;
  
  const selectedSize = document.querySelector('.price-pill.selected');
  const isLarge = selectedSize && selectedSize.textContent.includes('Large');
  const sizeLabel = isLarge ? 'Large' : 'Small';
  const itemPrice = isLarge ? currentProduct.largePrice : currentProduct.price;
  
  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    image: currentProduct.image,
    price: itemPrice,
    size: sizeLabel,
    quantity: 1
  };
  
  const existingItem = cart.find(item => item.id === cartItem.id && item.size === cartItem.size);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(cartItem);
  }
  
  updateBadges();
  showAddedNotification();
}

function showAddedNotification() {
  const btn = document.querySelector('.btn-cart');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.textContent = '✓ Added!';
    btn.style.background = '#4ade80';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
    }, 1500);
  }
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  const cartSummary = document.getElementById('cart-summary');
  
  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    if (cartSummary) cartSummary.style.display = 'none';
    updateBadges();
    return;
  }
  
  cartList.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">${item.size}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <div class="qty-num">${item.quantity}</div>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</div>
      <button class="qty-btn" onclick="removeFromCart(${index})" style="background: rgba(224, 85, 85, 0.2); color: #e05555; position: absolute; top: 10px; right: 10px;">×</button>
    </div>
  `).join('');
  
  updateCartTotals();
  if (cartSummary) cartSummary.style.display = 'block';
}

function updateQuantity(index, change) {
  const item = cart[index];
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(index);
    } else {
      renderCart();
    }
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    renderCart();
  }
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 5;
  const total = subtotal + serviceFee;
  
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const feeEl = document.getElementById('tax');
  
  if (subtotalEl) subtotalEl.textContent = 'R' + subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = 'R' + total.toFixed(2);
  if (feeEl) feeEl.textContent = 'R' + serviceFee.toFixed(2);
}

function updateBadges() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badgeIds = ['cart-badge-home', 'cart-badge-menu', 'cart-badge-login', 'cart-badge-cart'];
  
  badgeIds.forEach(id => {
    const badge = document.getElementById(id);
    if (badge) {
      if (totalQty > 0) {
        badge.textContent = totalQty;
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    }
  });
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 5;
  const total = subtotal + serviceFee;
  
  alert('Thank you for your order! Total: R' + total.toFixed(2));
  
  cart = [];
  renderCart();
  goTo('screen-home');
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('price-pill')) {
      document.querySelectorAll('.price-pill').forEach(pill => {
        pill.classList.remove('selected');
      });
      e.target.classList.add('selected');
    }
  });
  
  const cartBtn = document.querySelector('.btn-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      addToCart();
    });
  }
  
  updateBadges();
});
