// ===== Home Page Script =====

// Load Featured Products
async function loadFeaturedProducts() {
    try {
        const products = await StorageManager.getProducts();
        const featuredProducts = products.filter(p => p.featured).slice(0, 4);
        const container = document.getElementById('featuredProducts');

        if (!container) return;

        container.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <div style="position: relative;">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.new ? '<span class="product-badge">جديد</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="Cart.add('${product.id}')">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                        <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل المنتجات المميزة:', error);
    }
}

// Load New Products
async function loadNewProducts() {
    try {
        const products = await StorageManager.getProducts();
        const newProducts = products.filter(p => p.new).slice(0, 4);
        const container = document.getElementById('newProducts');

        if (!container) return;

        container.innerHTML = newProducts.map(product => `
            <div class="product-card">
                <div style="position: relative;">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <span class="product-badge">جديد</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="Cart.add('${product.id}')">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                        <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل المنتجات الجديدة:', error);
    }
}

// View Product Details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedProducts();
    await loadNewProducts();
});

