// ===== Products Page Script =====

let allProducts = [];
let filteredProducts = [];

// Load All Products from Supabase
async function loadProducts() {
    try {
        allProducts = await StorageManager.getProducts();

        // Check for category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');

        if (categoryFilter && categoryFilter !== 'all') {
            const categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryFilter}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        }

        applyFilters();
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        showNotification('خطأ في تحميل المنتجات', 'error');
    }
}

// Apply Filters
function applyFilters() {
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    const priceRadio = document.querySelector('input[name="price"]:checked');
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    
    // Get selected categories
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
    
    // Filter by category
    filteredProducts = allProducts.filter(product => {
        if (selectedCategories.includes('all') || selectedCategories.length === 0) {
            return true;
        }
        return selectedCategories.includes(product.category);
    });
    
    // Filter by price
    if (priceRadio && priceRadio.value !== 'all') {
        const priceRange = priceRadio.value;
        filteredProducts = filteredProducts.filter(product => {
            if (priceRange === '0-50') return product.price < 50;
            if (priceRange === '50-100') return product.price >= 50 && product.price < 100;
            if (priceRange === '100-200') return product.price >= 100 && product.price < 200;
            if (priceRange === '200+') return product.price >= 200;
            return true;
        });
    }
    
    // Filter by search
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    if (sortBy) {
        const sortValue = sortBy.value;
        if (sortValue === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'newest') {
            filteredProducts.sort((a, b) => b.id - a.id);
        }
    }
    
    displayProducts();
    updateProductsCount();
}

// Display Products
function displayProducts() {
    const container = document.getElementById('productsGrid');
    
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--gray-color);">لم يتم العثور على منتجات</h3>
                <p style="color: var(--gray-color);">جربي تغيير معايير البحث</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.new ? '<span class="product-badge">جديد</span>' : ''}
                ${product.stock < 5 ? '<span class="product-badge" style="background: var(--warning-color);">قطع محدودة</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p style="color: var(--gray-color); font-size: 0.9rem; margin-bottom: 0.5rem;">${product.description}</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="Cart.add('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'نفذت الكمية' : 'أضف للسلة'}
                    </button>
                    <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Products Count
function updateProductsCount() {
    const countElement = document.getElementById('productsCount');
    if (countElement) {
        countElement.textContent = `عرض ${filteredProducts.length} من ${allProducts.length} منتج`;
    }
}

// Reset Filters
function resetFilters() {
    // Reset category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    // Reset price radio
    document.querySelectorAll('input[name="price"]').forEach(radio => {
        radio.checked = radio.value === 'all';
    });
    
    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset sort
    const sortBy = document.getElementById('sortBy');
    if (sortBy) sortBy.value = 'newest';
    
    applyFilters();
}

// View Product Details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    
    // Add event listeners
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    document.querySelectorAll('input[name="price"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', applyFilters);
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
});

