// ── Menu Data ──
const MENU_ITEMS = [
  { id: 1, name: 'Cappuccino',     price: 45, large: 70, img: 'assets/Cappucino.png',         desc: 'Espresso with steamed milk and creamy foam.' },
  { id: 2, name: 'Flat White',     price: 45, large: 70, img: 'assets/Flat white.png',         desc: 'Smooth espresso with velvety microfoam.' },
  { id: 3, name: 'Cold Brew',      price: 45, large: 70, img: 'assets/Cold Brew.jpg',           desc: 'Smooth cold-brewed coffee concentrate.' },
  { id: 4, name: 'Pour Over',      price: 45, large: 70, img: 'assets/Pour over coffee.jpg',    desc: 'Hand-poured precision coffee.' },
  { id: 5, name: 'Café Mocha',     price: 45, large: 70, img: 'assets/Cafe Mocha.png',          desc: 'Espresso, steamed milk, and rich chocolate.' },
];

let cart = [];
let currentProduct = {};

// ── Navigation ──
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  if (screenId === 'screen-cart') renderCart();
}

// ── Show product screen with correct item data ──
function showProduct(index) {
  const item = MENU_ITEMS[index];
  if (!item) return;

  currentProduct = {
    id: item.id,
    name: item.name,
    img: item.img,
    price: item.price,
    largePrice: item.large,
    desc: item.desc,
  };

  // Swap the product screen content
  document.getElementById('product-img').src = item.img;
  document.getElementById('product-name').textContent = item.name;
  document.getElementById('product-desc').textContent = item.desc;

  // Reset size selection to Small
  document.querySelectorAll('.price-pill').forEach((p, i) => {
    p.classList.toggle('selected', i === 0);
  });

  goTo('screen-product');
}

// ── Add to cart ──
function addToCart() {
  if (!currentProduct.name) return;

  const selectedPill = document.querySelector('.price-pill.selected');
  const isLarge = selectedPill && selectedPill.textContent.includes('Large');
  const size = isLarge ? 'Large' : 'Small';
  const price = isLarge ? currentProduct.largePrice : currentProduct.price;

  const existing = cart.find(i => i.id === currentProduct.id && i.size === size);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      img: currentProduct.img,
      price: price,
      size: size,
      quantity: 1,
    });
  }

  updateBadges();
  showAddedFeedback();
}

function showAddedFeedback() {
  const btn = document.querySelector('.btn-cart');
  if (!btn) return;
  const original = btn.innerHTML;
  btn.textContent = '✓ Added!';
  btn.style.background = '#4ade80';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 1400);
}

// ── Render cart ──
function renderCart() {
  const list = document.getElementById('cart-list');
  const summary = document.getElementById('cart-summary');

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    if (summary) summary.style.display = 'none';
    updateBadges();
    return;
  }

  list.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">${item.size}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${i}, -1)">−</button>
          <div class="qty-num">${item.quantity}</div>
          <button class="qty-btn" onclick="updateQuantity(${i}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</div>
      <button class="cart-remove" onclick="removeFromCart(${i})">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `).join('');

  if (summary) summary.style.display = 'block';
  updateCartTotals();
  updateBadges();
}

function updateQuantity(index, change) {
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    renderCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  if (confirm('Clear your entire cart?')) {
    cart = [];
    renderCart();
  }
}

// ── Update totals — uses correct IDs: subtotal-val and total-val ──
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + 5;

  const subtotalEl = document.getElementById('subtotal-val');
  const totalEl = document.getElementById('total-val');

  if (subtotalEl) subtotalEl.textContent = 'R' + subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = 'R' + total.toFixed(2);
}

// ── Update cart badge on all nav bars ──
function updateBadges() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  ['cart-badge-home', 'cart-badge-login', 'cart-badge-menu', 'cart-badge-cart'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (totalQty > 0) {
      el.textContent = totalQty;
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Add to cart button
  const cartBtn = document.querySelector('.btn-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart();
    });
  }

  // Price pill selection
  document.addEventListener('click', e => {
    if (e.target.classList.contains('price-pill')) {
      document.querySelectorAll('.price-pill').forEach(p => p.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });

  updateBadges();
});
