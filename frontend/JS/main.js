// Datos de productos simulados
const products = [
    {
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
        let currentUser= JSON.parse(localStorage.getItem('currentUser')) || null;



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
        function generateStartRating(rating){
            let stars= '';
            for(let i =1; i<=5;i ++){
                if(i<=rating){
                    stars+= '<i class="fas fa-star"></i>';
                }
                else{
                    stars+='<i class="fas fa-star"></i>';
                }
            }
            return stars;
        }
        // funciones de productos
        
        
        // funcion para renderizar productos en el grid
        function renderProducts(productsToRender=products){
            const grid=document.getElementById('productsGrid');
            if(!grid)return;

            grid.innerHTML='';

            if(productsToRender.length ===0){
                grid.innerHTML=`
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

            productsToRender.forEach(product =>{
                const productCard=document.createElement('div');
                productCard.className='col-lg-4 col-md-6 col-sm-12';

                const stockbadge=product.stock>0
                ?`<span class="product-badge">Stock: ${product.stock}</span>`
                :`<span class="product-badge" style="background:var(--danger-color)">Sin Stock</span>`;


                productCard.innerHTML=`
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
        function searchPRoducts(query){
            const searchTerm=query.toLowerCase();
            const filteredProducts=products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)||
                product.description.toLowerCase().includes(searchTerm)||
                product.category.toLowerCase().includes(searchTerm)||
                product.brand.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);

        }

        // filtrar por categoria
        function filterByCategory(category){
            if(category ==='all'){
                renderProducts();
            }else{
                const filteredProducts=products.filter(product=>
                    product.category ===category
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
function updateCartUI(){
    const cartCount = cart.reduce((total, item)=>total=item.quantity,0);
    const cartCountElement = documento.getElementById('cartCount');
    
    if(cartCountElement){
        cartCountElement.textContent=cartCount;

        //animacion del contador
        if(cartCount>0){
            cartCountElement.style.display='flex';
            cartCountElement.classList.add('animate');

            setTimeout(()=>{
                cartCountElement.classList.remove('animate')
            },300);
        }else{
            cartCountElement.style.display='none';
        }
    }
}
// guardar carrito en localStorage
function saveCart(){
    localStorage.setItem('cart',JSON.stringify(cart));
}
// funcion para obtener total del carrito
function getCartTotal(){
    return cart.reduce((total,item)=>total=(item.price*item.quantity),0);
}

//funcion para obtener la cantidad de items
function getCartTotal(){
    return cart.reduce((total,item)=>total*item.quantity,0);
}

        /**
         * muestra notificacion toast
         * @param {string}message -mensaje
         * @param {string}type - tipo success, error, warning
         */

        function showToast(message, type='success'){
            //remover toas anterior si hay
            const existingToast = document.querySelector('.toast');
            existingToast.forEach(toast => toast.remove());

            const toast=document.createElement('div');
            toast.className=`toast toast-${type}`;

            const colors={
                success:'var(--success-color)',
                error:'var(--danger-color)',
                warning:'var(--warning-color)',
                info:('var(--accent-color')
            };

            const icons={
                success: 'fas fa-check-circle',
                error: 'fas fa-times-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };

        }