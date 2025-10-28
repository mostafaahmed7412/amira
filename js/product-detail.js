// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Load product details
async function loadProductDetail() {
    try {
        const products = await StorageManager.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.querySelector('main').innerHTML = `
                <div class="alert alert-danger text-center mt-5" style="animation: fadeIn 0.6s ease;">
                    <h3>المنتج غير موجود</h3>
                    <p>عذراً، المنتج الذي تبحث عنه غير متوفر.</p>
                    <a href="products.html" class="btn btn-primary mt-3">العودة للمنتجات</a>
                </div>
            `;
            return;
        }

        // Update page title
        document.title = `${product.name} - الهوس اللطيف`;

        // Populate product details
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = formatCurrency(product.price);
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productImage').src = product.image;
        document.getElementById('productStock').textContent = `${product.stock} متوفر`;
        document.getElementById('productCategory').textContent = getCategoryName(product.category);

        // Show badges
        if (product.featured) {
            document.getElementById('featuredBadge').classList.remove('d-none');
        }
        if (product.new) {
            document.getElementById('newBadge').classList.remove('d-none');
        }

        // Load related products
        await loadRelatedProducts(product.category, productId);

        // Setup event listeners
        setupEventListeners(product);
    } catch (error) {
        console.error('خطأ في تحميل تفاصيل المنتج:', error);
        document.querySelector('main').innerHTML = `
            <div class="alert alert-danger text-center mt-5">
                <h3>حدث خطأ</h3>
                <p>عذراً، حدث خطأ في تحميل المنتج.</p>
                <a href="products.html" class="btn btn-primary mt-3">العودة للمنتجات</a>
            </div>
        `;
    }
}

// Get category name in Arabic
function getCategoryName(category) {
    const categories = {
        'cups': 'أكواب',
        'decor': 'ديكور',
        'flowers': 'أزهار',
        'gifts': 'هدايا'
    };
    return categories[category] || category;
}

// Load related products
async function loadRelatedProducts(category, currentProductId) {
    try {
        const products = await StorageManager.getProducts();
        const related = products.filter(p => p.category === category && p.id !== currentProductId).slice(0, 4);

        const container = document.getElementById('relatedProducts');
        container.innerHTML = related.map((product, index) => `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="product-card" style="animation-delay: ${index * 0.1}s;">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.featured ? '<span class="badge bg-danger">مميز</span>' : ''}
                        ${product.new ? '<span class="badge bg-success">جديد</span>' : ''}
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p class="price">${formatCurrency(product.price)}</p>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-primary btn-sm w-100">
                            عرض التفاصيل
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل المنتجات ذات الصلة:', error);
    }
}

// Setup event listeners
function setupEventListeners(product) {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    // Quantity controls
    decreaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        if (current > 1) {
            quantityInput.value = current - 1;
            addInteractionAnimation(decreaseBtn);
        }
    });

    increaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        if (current < product.stock) {
            quantityInput.value = current + 1;
            addInteractionAnimation(increaseBtn);
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > product.stock) value = product.stock;
        quantityInput.value = value;
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        Cart.add(product.id, quantity);
        showNotification('تم إضافة المنتج إلى السلة بنجاح!', 'success');
        addInteractionAnimation(addToCartBtn);

        // Update cart count
        updateCartCount();
    });

    // Buy now
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        Cart.add(product.id, quantity);
        addInteractionAnimation(buyNowBtn);
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 300);
    });
}

// Add interaction animation
function addInteractionAnimation(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'pulse 0.6s ease';
    }, 10);
}

// Update cart count
function updateCartCount() {
    const cart = StorageManager.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductDetail();
    updateCartCount();
});

