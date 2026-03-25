function confirmAge() {
    localStorage.setItem('ageVerified', 'true');
    document.getElementById('ageVerification').classList.add('hidden');
    showToast('Добро пожаловать! 🎉', 'success');
}

function denyAge() {
    window.location.href = 'https://google.com';
}

// ========== НАВИГАЦИЯ ==========
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }

}

// ========== УВЕДОМЛЕНИЯ ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========== ТАЙМЕР АКЦИИ ==========
function startPromoTimer() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 дней от сейчас
    
    function updateTimer() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ========== ЗАГРУЗКА ТОВАРОВ ==========
const products = [
    {
        id: 1,
        brand: 'VOOPOO',
        title: 'DRAG X Plus',
        price: 4500,
        oldPrice: 5500,
        rating: 5,
        image: 'https://via.placeholder.com/300x250/1a1a1a/9d4edd?text=DRAG+X',
        badge: 'Хит'
    },
    {
        id: 2,
        brand: 'SMOK',
        title: 'Nord 5',
        price: 3200,
        oldPrice: null,
        rating: 4,
        image: 'https://via.placeholder.com/300x250/1a1a1a/00d9ff?text=Nord+5',
        badge: 'Новинка'
    },
    {
        id: 3,
        brand: 'Husky',
        title: 'Жидкость 30мл',
        price: 890,
        oldPrice: 1200,
        rating: 5,
        image: 'https://via.placeholder.com/300x250/1a1a1a/ff006e?text=Husky',
        badge: 'Акция'
    },
    {
        id: 4,
        brand: 'Brusko',
        title: 'Minican 3',
        price: 2100,
        oldPrice: null,
        rating: 4,
        image: 'https://via.placeholder.com/300x250/1a1a1a/00ff88?text=Minican',
        badge: null
    }
];

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </div>
                <div class="product-price">
                    <span class="price-current">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="price-old">${product.oldPrice} ₽</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                    <button class="btn-wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAge();
    loadFeaturedProducts();
    startPromoTimer();
    showWheel();
    updateCartCount();
});

// ========== СКРОЛЛ НАВБАР ==========
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});
