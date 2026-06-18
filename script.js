const products = [
  {id:1,name:'Aura Smart Watch',price:4999,category:'tech',rating:'4.9',icon:'⌚',desc:'Premium wearable with fitness insights and elegant style.'},
  {id:2,name:'ZenBook Sleeve',price:1299,category:'fashion',rating:'4.7',icon:'💼',desc:'Minimal protective laptop sleeve for students and creators.'},
  {id:3,name:'Echo Pods Pro',price:2499,category:'tech',rating:'4.8',icon:'🎧',desc:'Wireless earbuds with immersive sound and long battery life.'},
  {id:4,name:'Glow Desk Lamp',price:1799,category:'home',rating:'4.6',icon:'💡',desc:'Adjustable LED desk lamp for productive work sessions.'},
  {id:5,name:'Urban Sneakers',price:3199,category:'fashion',rating:'4.8',icon:'👟',desc:'Comfort-focused sneakers with a premium streetwear look.'},
  {id:6,name:'Focus Keyboard',price:2699,category:'tech',rating:'4.9',icon:'⌨️',desc:'Compact keyboard designed for fast and clean typing.'},
  {id:7,name:'Ceramic Mug Set',price:899,category:'home',rating:'4.5',icon:'☕',desc:'Elegant mug set for coffee, tea, and workspace aesthetics.'},
  {id:8,name:'Classic Hoodie',price:1899,category:'fashion',rating:'4.7',icon:'🧥',desc:'Soft everyday hoodie with a clean minimalist finish.'},
  {id:9,name:'Vision Webcam',price:2199,category:'tech',rating:'4.6',icon:'📷',desc:'HD webcam for meetings, classes, and project presentations.'},
  {id:10,name:'Plant Decor',price:699,category:'home',rating:'4.8',icon:'🪴',desc:'Modern desk plant decor for calm and fresh spaces.'},
  {id:11,name:'Travel Backpack',price:2899,category:'fashion',rating:'4.9',icon:'🎒',desc:'Spacious backpack with organized pockets and premium finish.'},
  {id:12,name:'Mini Speaker',price:1599,category:'tech',rating:'4.5',icon:'🔊',desc:'Portable speaker with clear audio for indoor and outdoor use.'}
];

let cart = JSON.parse(localStorage.getItem('luxecart-cart')) || [];
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const dashProducts = document.getElementById('dashProducts');
const dashRevenue = document.getElementById('dashRevenue');
const dashItems = document.getElementById('dashItems');

function money(value){ return `₹${value.toLocaleString('en-IN')}`; }
function save(){ localStorage.setItem('luxecart-cart', JSON.stringify(cart)); }

function renderProducts(){
  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter(p =>
    (category === 'all' || p.category === category) &&
    (p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term))
  );
  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-icon">${p.icon}</div>
      <div class="meta"><span>${p.category.toUpperCase()}</span><span>${p.rating}★</span></div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="card-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-id="${p.id}">Add</button></div>
    </article>
  `).join('') || '<p>No products found.</p>';
}

function addToCart(id){
  const existing = cart.find(item => item.id === id);
  if(existing) existing.qty += 1;
  else cart.push({id, qty:1});
  save();
  updateCart();
}

function updateQty(id, change){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += change;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  save();
  updateCart();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  save();
  updateCart();
}

function updateCart(){
  const detailed = cart.map(i => ({...products.find(p => p.id === i.id), qty:i.qty}));
  cartItems.innerHTML = detailed.length ? detailed.map(item => `
    <div class="cart-item">
      <div class="emoji">${item.icon}</div>
      <div><strong>${item.name}</strong><br><span>${money(item.price)}</span><div class="qty"><button onclick="updateQty(${item.id},-1)">−</button><span>${item.qty}</span><button onclick="updateQty(${item.id},1)">+</button></div></div>
      <button class="remove" onclick="removeItem(${item.id})">Remove</button>
    </div>
  `).join('') : '<p>Your cart is empty. Add products to begin checkout.</p>';
  const subtotal = detailed.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const count = detailed.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
  subtotalEl.textContent = money(subtotal);
  taxEl.textContent = money(tax);
  totalEl.textContent = money(total);
  dashProducts.textContent = products.length;
  dashRevenue.textContent = money(total);
  dashItems.textContent = count;
}

document.addEventListener('click', e => {
  if(e.target.matches('.add-btn')) addToCart(Number(e.target.dataset.id));
});
searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
document.getElementById('openCart').addEventListener('click', () => { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); });
document.getElementById('closeCart').addEventListener('click', () => { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); });
document.getElementById('checkoutLink').addEventListener('click', () => cartDrawer.classList.remove('open'));

document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('orderMessage');
  if(cart.length === 0){ msg.textContent = 'Please add at least one product before placing an order.'; return; }
  const name = document.getElementById('customerName').value.trim();
  msg.textContent = `Thank you, ${name}! Your demo order has been placed successfully.`;
  cart = []; save(); updateCart(); e.target.reset();
});

const savedTheme = localStorage.getItem('luxecart-theme');
if(savedTheme) document.documentElement.dataset.theme = savedTheme;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('luxecart-theme', next);
});

renderProducts();
updateCart();
