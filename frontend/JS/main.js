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
// carrito de compras - variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [...products];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;



// funcion para formatear precios
/**
 * 
 * @param {number} price -precio a formatear
 * @returns {string} precio formateado
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}
// funcion para generar estrellas
function generateStartRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="fas fa-star"></i>';
        }
    }
    return stars;
}
// funciones de productos


// funcion para renderizar productos en el grid
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (productsToRender.length === 0) {
        grid.innerHTML = `
                <div class="col-12">
                <div class="empty-state">
                <i class= fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros terminos de busqueda</p>
                </div>
                </div>
                `;
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-lg-4 col-md-6 col-sm-12';

        const stockbadge = product.stock > 0 ?
            `<span class="product-badge">Stock: ${product.stock}</span>` :
            `<span class="product-badge" style="background:var(--danger-color)">Sin Stock</span>`;


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
    })
}

// funcion para buscar
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

// filtrar por categoria
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
// funcion para actualizar la UI del carrito
function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total = item.quantity, 0);
    const cartCountElement = documento.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;

        //animacion del contador
        if (cartCount > 0) {
            cartCountElement.style.display = 'flex';
            cartCountElement.classList.add('animate');

            setTimeout(() => {
                cartCountElement.classList.remove('animate')
            }, 300);
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}
// guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// funcion para obtener total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total = (item.price * item.quantity), 0);
}

//funcion para obtener la cantidad de items
function getCartItemCount() {
    return cart.reduce((total, item) => total * item.quantity, 0);
}

/**
 * muestra notificacion toast
 * @param {string}message -mensaje
 * @param {string}type - tipo success, error, warning
 */

function showToast(message, type = 'success') {
    //remover toas anterior si hay
    const existingToast = document.querySelector('.toast');
    existingToast.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: ('var(--accent-color')
    };

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    toast.style.cssText = `
            position:fixed;
            top:20px;
            right:20px;
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
        max-width: 300px;`;

    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>`;

    document.body.appendChild(toast);

    //auto-remove despues de 3s
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        //busqueda en tiempo real
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2 || query.length === 0) {
                searchProducts(query);
            }
        });

        // busqueda al hacer click
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value.trim());
        });

        // busqueda al presionar enter
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

// funcion para inicializar la aplicacion
function initializeApp() {
    renderProducts(); //renderizar productos
    updateCartUI(); //actualizar UI del carrito
    setupSearch(); //configurar busqueda
    addAnimations(); //agregar animaciones
    setupActiveNavigation(); //configurar navegacion activa
    setupGlobalEvents();

    console.log('TechStore inicializado correctamente');


}

// funcion para navegacion activa
function setupActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index,html';
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}
// eventos globales
function setupGlobalEvents() {
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

    //  cerrar el navbar al hacer click en un enlace

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


// funcion para la pagina del carrito
function initCartPage() {
    renderCartItems();
    updateCartSumary();

}

// funcion para renderizar items del carrito
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
        </div>`;
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

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

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
        updateCartSumary();
    }
}

// actualizar cantidad directamente
function updateQuantityDirect(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    if (quantity > item.stock) {
        showToast('No hay mas stock disponible', 'warning');
        return;
    }
    item.quantity = quantity;
    saveCart();
    updateCartUI();
    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateCartSumary();
    }
}
//remover del carrito
function remoneFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateCartSumary();

    }
    showToast('Producto eliminado del carrito', 'info');

}
// actualizar resumen del carrito
function updateCartSumary() {
    const sumaryContainer = document.getElementById('cartSummary');
    if (!sumaryContainer) return;

    const subtotal = getCartTotal();
    const shipping = subtotal > 1000 ? 0 : 150;
    const tax = subtotal * 0.16; //iva del 16%
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

//proceder el check out
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Tucarrito esta vacio', 'warning');
        return;
    }
    showToast('Funcionalidad de pago proximamente...', 'info');

}

function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartUI();

        if (document.getElementById('cartItems')) {
            renderCartItems();
            updateCartSumary();
        }
        showToast('Carrito vacio', 'info');
    }
}
// inicializar cuando el DOM esta listo
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();

    //si estamos en la pag. del carrito
    if (window.location.pathname.includes('cart.html')) {
        initCartPage();
    }

    // configurar evento para el icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && !window.location.pathname.includes('cart.html')) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
});

// actualizar el carrito cuando cambie el localstorage (util para varias pesta;as)
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        cart.JSON.parse(e.newValue) || [];
        updateCartUI();

        //si se esta en la pagina de carrito acutaliza
        if (document.getElementById('cartItems')) {
            renderCartItems();
            updateCartSumary();
        }
    }
});