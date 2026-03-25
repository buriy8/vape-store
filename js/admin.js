// ========== АДМИН-ПАНЕЛЬ VAPOR STORE ==========

// Глобальные переменные
let currentUser = null;
let orders = [];
let products = [];
let customers = [];

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
function checkAuth() {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('adminAuth');
    window.location.href = 'index.html';
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        loadDashboard();
        loadOrders();
        loadProducts();
        loadCustomers();
        updateStats();
    }
});

// ========== ДАШБОРД ==========
function loadDashboard() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;

    const todayOrders = orders.filter(o => isToday(o.date)).length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>📦 Заказы сегодня</h3>
            <div class="value">${todayOrders}</div>
        </div>
        <div class="stat-card">
            <h3>💰 Выручка</h3>
            <div class="value">${totalRevenue.toLocaleString()} ₽</div>
        </div>
        <div class="stat-card">
            <h3>👥 Клиенты</h3>
            <div class="value">${totalCustomers}</div>
        </div>
        <div class="stat-card">
            <h3>🏷️ Товары</h3>
            <div class="value">${totalProducts}</div>
        </div>
    `;
}

function updateStats() {
    // Обновление статистики в реальном времени
    setInterval(() => {
        loadDashboard();
    }, 60000); // Каждую минуту
}

function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// ========== УПРАВЛЕНИЕ ЗАКАЗАМИ ==========
function loadOrders() {
    // Загрузка заказов из localStorage (в реальном проекте - с сервера)
    const storedOrders = localStorage.getItem('orders');
    orders = storedOrders ? JSON.parse(storedOrders) : [
        {
            id: 1234,
            customer: 'Иван Петров',
            email: 'ivan@example.com',
            phone: '+7 (999) 123-45-67',
            total: 5600,
            status: 'new',
            date: '2024-01-20',
            items: [
                { name: 'VOOPOO DRAG X', quantity: 1, price: 4500 },
                { name: 'Жидкость Husky 30мл', quantity: 2, price: 890 }
            ],
            address: 'г. Москва, ул. Ленина 10, кв. 5'
        },
        {
            id: 1233,
            customer: 'Анна Смирнова',
            email: 'anna@example.com',
            phone: '+7 (999) 765-43-21',
            total: 3200,
            status: 'processing',
            date: '2024-01-19',
            items: [
                { name: 'SMOK Nord 5', quantity: 1, price: 3200 }
            ],
            address: 'г. СПб, Невский проспект 50'
        },
        {
            id: 1232,
            customer: 'Максим Козлов',
            email: 'max@example.com',
            phone: '+7 (999) 111-22-33',
            total: 8900,
            status: 'delivered',
            date: '2024-01-18',
            items: [
                { name: 'VOOPOO Vinci', quantity: 2, price: 4000 },
                { name: 'Жидкость Brusko 50мл', quantity: 3, price: 1200 }
            ],
            address: 'г. Екатеринбург, ул. Малышева 25'
        }
    ];

    renderOrders();
}

function renderOrders() {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;

    if (orders.length === 0) {
        ordersTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #b0b0b0; margin-bottom: 20px;"></i>
                    <p>Заказов пока нет</p>
                </td>
            </tr>
        `;
        return;
    }

    ordersTable.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <div>${order.customer}</div>
                <small style="color: #b0b0b0;">${order.phone}</small>
            </td>
            <td>${order.total.toLocaleString()} ₽</td>
            <td>
                <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>🆕 Новый</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>⏳ В обработке</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>📦 Отправлен</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ Доставлен</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Отменён</option>
                </select>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <button class="btn-view" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-delete" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast(`Статус заказа #${orderId} обновлён`, 'success');
        
        // Отправка уведомления клиенту (в реальном проекте)
        sendNotification(order.customer, `Ваш заказ #${orderId}: ${getStatusText(newStatus)}`);
    }
}

function getStatusText(status) {
    const statuses = {
        'new': 'Принят в обработку',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменён'
    };
    return statuses[status] || status;
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderModal');
    if (modal) {
        document.getElementById('orderDetails').innerHTML = `
            <h3>Заказ #${order.id}</h3>
            <div class="order-info">
                <p><strong>Клиент:</strong> ${order.customer}</p>
                <p><strong>Телефон:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Адрес:</strong> ${order.address}</p>
                <p><strong>Дата:</strong> ${formatDate(order.date)}</p>
                <p><strong>Статус:</strong> ${getStatusText(order.status)}</p>
            </div>
            <h4>Товары:</h4>
            <ul class="order-items">
                ${order.items.map(item => `
                    <li>${item.name} × ${item.quantity} — ${item.price * item.quantity} ₽</li>
                `).join('')}
            </ul>
            <p class="order-total"><strong>Итого: ${order.total.toLocaleString()} ₽</strong></p>
        `;
        modal.classList.add('active');
    }
}

function deleteOrder(orderId) {
    if (confirm(`Удалить заказ #${orderId}?`)) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
        showToast('Заказ удалён', 'error');
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========== УПРАВЛЕНИЕ ТОВАРАМИ ==========
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    products = storedProducts ? JSON.parse(storedProducts) : [
        {
            id: 1,
            name: 'VOOPOO DRAG X Plus',
            brand: 'VOOPOO',
            category: 'pods',
            price: 4500,
            oldPrice: 5500,
            stock: 25,
            image: 'https://via.placeholder.com/100x100/1a1a1a/9d4edd?text=DRAG',
            rating: 5
        },
        {
            id: 2,
            name: 'SMOK Nord 5',
            brand: 'SMOK',
            category: 'pods',
            price: 3200,
            oldPrice: null,
            stock: 15,
            image: 'https://via.placeholder.com/100x100/1a1a1a/00d9ff?text=Nord',
            rating: 4
        },
        {
            id: 3,
            name: 'Жидкость Husky 30мл',
            brand: 'Husky',
            category: 'liquids',
            price: 890,
            oldPrice: 1200,
            stock: 50,
            image: 'https://via.placeholder.com/100x100/1a1a1a/ff006e?text=Husky',
            rating: 5
        },
        {
            id: 4,
            name: 'Brusko Minican 3',
            brand: 'Brusko',
            category: 'pods',
            price: 2100,
            oldPrice: null,
            stock: 8,
            image: 'https://via.placeholder.com/100x100/1a1a1a/00ff88?text=Minican',
            rating: 4
        }
    ];

    renderProducts();
}

function renderProducts() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable) return;

    productsTable.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            </td>
            <td>
                <div>${product.name}</div>
                <small style="color: #b0b0b0;">${product.brand}</small>
            </td>
            <td>${product.category}</td>
            <td>
                <span style="color: #00ff88;">${product.price} ₽</span>
                ${product.oldPrice ? `<br><small style="text-decoration: line-through; color: #b0b0b0;">${product.oldPrice} ₽</small>` : ''}
            </td>
            <td>
                <span style="color: ${product.stock < 10 ? '#ff006e' : '#00ff88'};">
                    ${product.stock} шт.
                </span>
            </td>
            <td>${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addProduct() {
    const modal = document.getElementById('productModal');
    if (modal) {
        document.getElementById('productForm').reset();
        document.getElementById('productModalTitle').textContent = 'Добавить товар';
        document.getElementById('productId').value = '';
        modal.classList.add('active');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    if (modal) {
        document.getElementById('productModalTitle').textContent = 'Редактировать товар';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.oldPrice || '';
        document.getElementById('productStock').value = product.stock;
        modal.classList.add('active');
    }
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const productData = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        oldPrice: document.getElementById('productOldPrice').value ? parseInt(document.getElementById('productOldPrice').value) : null,
        stock: parseInt(document.getElementById('productStock').value),
        image: `https://via.placeholder.com/100x100/1a1a1a/9d4edd?text=${document.getElementById('productName').value.substring(0, 5)}`,
        rating: 5
    };

    if (id) {
        const index = products.findIndex(p => p.id == id);
        products[index] = productData;
        showToast('Товар обновлён', 'success');
    } else {
        products.push(productData);
        showToast('Товар добавлен', 'success');
    }

    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    closeProductModal();
}

function deleteProduct(productId) {
    if (confirm('Удалить этот товар?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        showToast('Товар удалён', 'error');
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========== УПРАВЛЕНИЕ КЛИЕНТАМИ ==========
function loadCustomers() {
    const storedCustomers = localStorage.getItem('customers');
    customers = storedCustomers ? JSON.parse(storedCustomers) : [
        {
            id: 1,
            name: 'Иван Петров',
            email: 'ivan@example.com',
            phone: '+7 (999) 123-45-67',
            orders: 5,
            totalSpent: 25000,
            registered: '2024-01-15'
        },
        {
            id: 2,
            name: 'Анна Смирнова',
            email: 'anna@example.com',
            phone: '+7 (999) 765-43-21',
            orders: 3,
            totalSpent: 12000,
            registered: '2024-01-10'
        }
    ];

    renderCustomers();
}

function renderCustomers() {
    const customersTable = document.getElementById('customersTable');
    if (!customersTable) return;

    customersTable.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>${customer.totalSpent.toLocaleString()} ₽</td>
            <td>${formatDate(customer.registered)}</td>
            <td>
                <button class="btn-view" onclick="viewCustomer(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    alert(`Клиент: ${customer.name}\nEmail: ${customer.email}\nЗаказов: ${customer.orders}\nПотрачено: ${customer.totalSpent} ₽`);
}

// ========== УВЕДОМЛЕНИЯ ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

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

function sendNotification(customer, message) {
    // В реальном проекте здесь будет отправка email/SMS
    console.log(`Уведомление для ${customer}: ${message}`);
}

// ========== УТИЛИТЫ ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function filterOrders(status) {
    const filtered = status === 'all' 
        ? orders 
        : orders.filter(o => o.status === status);
    
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;

    // Перерисовка таблицы с отфильтрованными заказами
    // (упрощённая версия)
}

function searchOrders(query) {
    const filtered = orders.filter(o => 
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.id.toString().includes(query)
    );
    // Перерисовка таблицы
}

// ========== ЭКСПОРТ ДАННЫХ ==========
function exportOrders() {
    const data = JSON.stringify(orders, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Заказы экспортированы', 'success');
}

function exportProducts() {
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Товары экспортированы', 'success');
}

// ========== НАСТРОЙКИ МАГАЗИНА ==========
function saveSettings() {
    const settings = {
        storeName: document.getElementById('storeName')?.value || 'VAPOR STORE',
        email: document.getElementById('storeEmail')?.value || '',
        phone: document.getElementById('storePhone')?.value || '',
        address: document.getElementById('storeAddress')?.value || '',
        freeShippingThreshold: parseInt(document.getElementById('freeShipping')?.value) || 5000
    };

    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showToast('Настройки сохранены', 'success');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('storeSettings')) || {};
    
    if (document.getElementById('storeName')) {
        document.getElementById('storeName').value = settings.storeName || 'VAPOR STORE';
    }
    if (document.getElementById('storeEmail')) {
        document.getElementById('storeEmail').value = settings.email || '';
    }
    if (document.getElementById('storePhone')) {
        document.getElementById('storePhone').value = settings.phone || '';
    }
    if (document.getElementById('storeAddress')) {
        document.getElementById('storeAddress').value = settings.address || '';
    }
    if (document.getElementById('freeShipping')) {
        document.getElementById('freeShipping').value = settings.freeShippingThreshold || 5000;
    }
}

// ========== ГРАФИКИ И СТАТИСТИКА ==========
function loadCharts() {
    // В реальном проекте здесь будет интеграция с Chart.js
    const chartContainer = document.getElementById('salesChart');
    if (chartContainer) {
        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-chart-line" style="font-size: 4rem; color: #9d4edd; margin-bottom: 20px;"></i>
                <p>График продаж (интеграция с Chart.js)</p>
            </div>
        `;
    }
}

// ========== БЕЗОПАСНОСТЬ ==========
function checkSession() {
    // Проверка сессии администратора
    const lastActivity = localStorage.getItem('adminLastActivity');
    const now = Date.now();
    
    if (lastActivity && now - lastActivity > 3600000) { // 1 час
        logout();
        showToast('Сессия истекла', 'error');
    }
    
    localStorage.setItem('adminLastActivity', now);
}

// Обновление активности каждые 5 минут
setInterval(checkSession, 300000);

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
window.addEventListener('load', () => {
    checkSession();
    loadSettings();
    loadCharts();
});

// ========== ГОРЯЧИЕ КЛАВИШИ ==========
document.addEventListener('keydown', (e) => {
    // Ctrl + S - сохранить
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProduct();
    }
    
    // Escape - закрыть модальное окно
    if (e.key === 'Escape') {
        closeOrderModal();
        closeProductModal();
    }
});

console.log('️ Admin Panel Loaded - VAPOR STORE');
