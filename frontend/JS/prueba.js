        // datos de productos simulados
        const products = [{
                id: 1,
                name: "Intel Core i7-13700K",
                price: 15999,
                category: "procesadores",
                image: "fas fa-microchip",
                description: "Procesador Intel de 13va generación, 16 núcleos"
            },
            {
                id: 2,
                name: "NVIDIA RTX 4070 Ti",
                price: 28999,
                category: "graficas",
                image: "fas fa-memory",
                description: "Tarjeta gráfica NVIDIA RTX 4070 Ti, 12GB GDDR6X"
            },
            {
                id: 3,
                name: "Corsair Vengeance 32GB DDR5",
                price: 6999,
                category: "memoria",
                image: "fas fa-memory",
                description: "Memoria RAM DDR5 32GB (2x16GB) 5600MHz"
            },
            {
                id: 4,
                name: "Samsung 980 PRO 1TB NVMe",
                price: 4999,
                category: "almacenamiento",
                image: "fas fa-hdd",
                description: "SSD NVMe M.2 de 1TB, velocidades hasta 7,000 MB/s"
            },
            {
                id: 5,
                name: "ASUS ROG Swift 27'' 144Hz",
                price: 12999,
                category: "monitores",
                image: "fas fa-desktop",
                description: "Monitor Gaming 27'' QHD, 144Hz, G-Sync"
            },
            {
                id: 6,
                name: "AMD Ryzen 9 7950X",
                price: 18999,
                category: "procesadores",
                image: "fas fa-microchip",
                description: "Procesador AMD Ryzen 9, 16 núcleos, 32 hilos"
            }
        ];

        // carrito de compras - variables globales
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let filteredProducts = [...products];



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

        // funcion para renderizar productos
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-lg-4 col-md-6';
                productCard.innerHTML = `
        <div class="product-card">
        <div class="product-image">
        <i class="${product.image}"></i>
        </div>

        <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="text-muted">${product.description}</p>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-add-cart" onclick="addToCart(${product.id})">
        <i class="fas fa-shopping-cart me-2"></i>Agregar al carrito
        </button>
        </div>
        </div>
        `;
                grid.appendChild(productCard);
            });
        }

        //funcion para agregar productos al carrito
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            updateCartUI();
            saveCart();


            //mostrar notificacion
            showToast(`${product.name}, agregado al carrito`);

        }

        // funcion para actualizar la interfaz del carrito
        function updateCartUI() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = cartCount;
        }

        // funcion para guardar el carrito en localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // funcion para mostrar notificaciones
        function showToast(message) {

            //crear toas dinamicamente
            const toastContainer = document.createElement('div');
            toastContainer.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    background:var(--accent-color);
    color:white;
    padding:15px 20px;
    border-radius:5px;
    z-index:1000;
    animation:slideIn 0.3s ease;`;
            toastContainer.textContent = message;

            document.body.appendChild(toastContainer);

            setTimeout(() => {
                toastContainer.remove();
            }, 3000);
        }

        //animacion para el toast
        const style = document.createElement('style');
        style.textContent = `
@keyframes slideIn {
from{
transform:translateX(100%);
opacity:0;
}
to{
transform:translateX(0);
opacity:1;
}
}
`;
        document.head.appendChild(style);

        // Inicializar aplicación
        document.addEventListener('DOMContentLoaded', function () {
            renderProducts();
            updateCartUI();
        });