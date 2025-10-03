// ===========================================
// TechStore - JavaScript Principal
// Desarrollado por: Damaris Quiroz
// ===========================================

// Datos de productos simulados
const products = [{
        id: 1,
        name: "Intel Core i7-13700K",
        price: 15999,
        category: "procesadores",
        image: "fas fa-microchip",
        description: "Procesador Intel de 13va generación, 16 núcleos",
        rating: 5,
        stock: 15,
        brand: "Intel"
    },
    {
        id: 2,
        name: "NVIDIA RTX 4070 Ti",
        price: 28999,
        category: "graficas",
        image: "fas fa-memory",
        description: "Tarjeta gráfica NVIDIA RTX 4070 Ti, 12GB GDDR6X",
        rating: 5,
        stock: 8,
        brand: "NVIDIA"
    },
    {
        id: 3,
        name: "Corsair Vengeance 32GB DDR5",
        price: 6999,
        category: "memoria",
        image: "fas fa-memory",
        description: "Memoria RAM DDR5 32GB (2x16GB) 5600MHz",
        rating: 4,
        stock: 25,
        brand: "Corsair"
    },
    {
        id: 4,
        name: "Samsung 980 PRO 1TB NVMe",
        price: 4999,
        category: "almacenamiento",
        image: "fas fa-hdd",
        description: "SSD NVMe M.2 de 1TB, velocidades hasta 7,000 MB/s",
        rating: 5,
        stock: 30,
        brand: "Samsung"
    },
    {
        id: 5,
        name: "ASUS ROG Swift 27'' 144Hz",
        price: 12999,
        category: "monitores",
        image: "fas fa-desktop",
        description: "Monitor Gaming 27'' QHD, 144Hz, G-Sync",
        rating: 4,
        stock: 12,
        brand: "ASUS"
    },
    {
        id: 6,
        name: "AMD Ryzen 9 7950X",
        price: 18999,
        category: "procesadores",
        image: "fas fa-microchip",
        description: "Procesador AMD Ryzen 9, 16 núcleos, 32 hilos",
        rating: 5,
        stock: 10,
        brand: "AMD"
    },
    {
        id: 7,
        name: "MSI GeForce RTX 4060",
        price: 19999,
        category: "graficas",
        image: "fas fa-memory",
        description: "Tarjeta gráfica MSI RTX 4060, 8GB GDDR6",
        rating: 4,
        stock: 20,
        brand: "MSI"
    },
    {
        id: 8,
        name: "Kingston Fury Beast 16GB",
        price: 3499,
        category: "memoria",
        image: "fas fa-memory",
        description: "Memoria RAM DDR4 16GB (2x8GB) 3200MHz",
        rating: 4,
        stock: 35,
        brand: "Kingston"
    }
];

// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

// Función para formatear precios en pesos mexicanos
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

// Función para generar estrellas de rating
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// ===========================================
// FUNCIONES DE PRODUCTOS
// ===========================================

// Función para renderizar productos en el grid
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            </div>
        `;
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-lg-4 col-md-6 col-sm-12';

        const stockBadge = product.stock > 0 ?
            `<span class="product-badge">Stock: ${product.stock}</span>` :
            `<span class="product-badge" style="background: var(--danger-color)">Sin Stock</span>`;

        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <i class="${product.image}"></i>
                    ${stockBadge}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                    </div>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button 
                        class="btn-add-cart ${product.stock === 0 ? 'disabled' : ''}" 
                        onclick="addToCart(${product.id})"
                        ${product.stock === 0 ? 'disabled' : ''}
                    >
                        <i class="fas fa-shopping-cart me-2"></i>
                        ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );

    renderProducts(filteredProducts);
}

// Función para filtrar por categoría
function filterByCategory(category) {
    if (category === 'all') {
        renderProducts();
    } else {
        const filteredProducts = products.filter(product =>
            product.category === category
        );
        renderProducts(filteredProducts);
    }
}

// ===========================================
// FUNCIONES DEL CARRITO
// ===========================================

// Función para agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showToast('Producto sin stock disponible', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
            showToast('Cantidad actualizada en el carrito', 'success');
        } else {
            showToast('No hay más stock disponible', 'warning');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showToast('Producto agregado al carrito', 'success');
    }

    updateCartUI();
    saveCart();
}

// Función para actualizar la UI del carrito
function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;

        // Animación del contador
        if (cartCount > 0) {
            cartCountElement.style.display = 'flex';
            cartCountElement.classList.add('animate');
            setTimeout(() => {
                cartCountElement.classList.remove('animate');
            }, 300);
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Función para guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para obtener total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para obtener cantidad total de items
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Función para mostrar notificaciones toast
function showToast(message, type = 'success') {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--accent-color)'
    };

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1050;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
    `;

    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Auto-remove después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Función para manejar la búsqueda en tiempo real
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        // Búsqueda en tiempo real
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2 || query.length === 0) {
                searchProducts(query);
            }
        });

        // Búsqueda al hacer clic
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value.trim());
        });

        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value.trim());
            }
        });
    }
}

// ===========================================
// ANIMACIONES CSS ADICIONALES
// ===========================================
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .animate {
            animation: bounce 0.3s ease;
        }
        
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            80% {
                transform: translateY(-5px);
            }
        }
        
        .product-card {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }
        .product-card:nth-child(5) { animation-delay: 0.5s; }
        .product-card:nth-child(6) { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);
}

// ===========================================
// INICIALIZACIÓN
// ===========================================

// Función para inicializar la aplicación
function initializeApp() {
    // Renderizar productos
    renderProducts();

    // Actualizar UI del carrito
    updateCartUI();

    // Configurar búsqueda
    setupSearch();

    // Agregar animaciones
    addAnimations();

    // Configurar navegación activa
    setupActiveNavigation();

    // Configurar eventos globales
    setupGlobalEvents();

    console.log('TechStore inicializado correctamente');
}

// Función para configurar navegación activa
function setupActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Función para configurar eventos globales
function setupGlobalEvents() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Cerrar navbar mobile al hacer clic en un enlace
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

// ===========================================
// FUNCIONES PARA PÁGINAS ESPECÍFICAS
// ===========================================

// Función específica para la página del carrito
function initCartPage() {
    renderCartItems();
    updateCartSummary();
}

// Función para renderizar items del carrito
function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Explora nuestros productos y encuentra lo que necesitas</p>
                <a href="index.html" class="btn btn-primary-custom">
                    <i class="fas fa-arrow-left me-2"></i>Seguir Comprando
                </a>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    <div class="cart-item-image">
                        <i class="${item.image}"></i>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p class="text-muted">${item.description}</p>
                        <small class="text-muted">Precio unitario: ${formatPrice(item.price)}</small>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" max="${item.stock}" 
                               onchange="updateQuantityDirect(${item.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="cart-item-price">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
}

// Función para actualizar cantidad
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > item.stock) {
        showToast('No hay más stock disponible', 'warning');
        return;
    }

    item.quantity = newQuantity;
    saveCart();
    updateCartUI();

    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateCartSummary();
    }
}

// Función para actualizar cantidad directamente
function updateQuantityDirect(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const quantity = parseInt(newQuantity);

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (quantity > item.stock) {
        showToast('No hay más stock disponible', 'warning');
        return;
    }

    item.quantity = quantity;
    saveCart();
    updateCartUI();

    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateCartSummary();
    }
}

// Función para remover del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();

    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateCartSummary();
    }

    showToast('Producto eliminado del carrito', 'info');
}

// Función para actualizar resumen del carrito
function updateCartSummary() {
    const summaryContainer = document.getElementById('cartSummary');
    if (!summaryContainer) return;

    const subtotal = getCartTotal();
    const shipping = subtotal > 1000 ? 0 : 150;
    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + shipping + tax;

    summaryContainer.innerHTML = `
        <h4 class="mb-3">Resumen del Pedido</h4>
        <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Envío:</span>
            <span>${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>IVA (16%):</span>
            <span>${formatPrice(tax)}</span>
        </div>
        <hr>
        <div class="cart-total d-flex justify-content-between">
            <span>Total:</span>
            <span>${formatPrice(total)}</span>
        </div>
        <div class="mt-3">
            ${shipping === 0 ? 
                '<small class="text-success"><i class="fas fa-shipping-fast"></i> Envío gratis en compras mayores a $1,000</small>' :
                '<small class="text-muted">Envío gratis en compras mayores a $1,000</small>'
            }
        </div>
        <div class="mt-4 d-grid gap-2">
            <button class="btn btn-primary-custom btn-lg" onclick="proceedToCheckout()">
                <i class="fas fa-credit-card me-2"></i>Proceder al Pago
            </button>
            <a href="index.html" class="btn btn-secondary-custom">
                <i class="fas fa-arrow-left me-2"></i>Seguir Comprando
            </a>
        </div>
    `;
}

// Función para proceder al checkout (placeholder)
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'warning');
        return;
    }

    // Por ahora solo mostrar mensaje
    showToast('Funcionalidad de pago próximamente...', 'info');

    // Aquí iría la integración con pasarela de pago
    // Por ejemplo: Stripe, PayPal, Mercado Pago, etc.
}

// Función para limpiar carrito
function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartUI();

        if (document.getElementById('cartItems')) {
            renderCartItems();
            updateCartSummary();
        }

        showToast('Carrito vaciado', 'info');
    }
}

// ===========================================
// EVENT LISTENERS PRINCIPALES
// ===========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();

    // Si estamos en la página del carrito
    if (window.location.pathname.includes('cart.html')) {
        initCartPage();
    }

    // Configurar evento para el icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && !window.location.pathname.includes('cart.html')) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
});

// Actualizar carrito cuando cambie el localStorage (útil para múltiples pestañas)
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        cart = JSON.parse(e.newValue) || [];
        updateCartUI();

        // Si estamos en la página del carrito, actualizar
        if (document.getElementById('cartItems')) {
            renderCartItems();
            updateCartSummary();
        }
    }
});