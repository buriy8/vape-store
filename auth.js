// Обновление меню пользователя
function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    const auth = checkAuth();
    
    if (auth.isLoggedIn && auth.user) {
        userMenu.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn" onclick="toggleUserDropdown()">
                    <i class="fas fa-user-circle"></i>
                    <span>${auth.user.name}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="userDropdown">
                    <a href="profile.html"><i class="fas fa-user"></i> Профиль</a>
                    <a href="orders.html"><i class="fas fa-box"></i> Заказы</a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Выйти</a>
                </div>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="login.html" class="btn-login-nav">
                <i class="fas fa-user"></i>
                <span>Войти</span>
            </a>
        `;
    }
}

// Выпадающее меню
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}


// Обновление данных пользователя
function updateUserProfile(updatedData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = getCurrentUser();
    
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        return true;
    }
    return false;
}

// Добавление заказа пользователю
function addUserOrder(order) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = getCurrentUser();
    
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].orders.push(order);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        return true;
    }
    return false;
}

// Уведомления
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
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
    
    setTimeout(() => toast.remove(), 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateUserMenu();
});

// Закрытие dropdown при клике вне
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    
    if (dropdown && !dropdown.contains(e.target) && !userBtn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});
