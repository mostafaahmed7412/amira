// ===== Cart Page Script =====

// Load Cart Items
async function loadCartItems() {
    try {
        const cartItems = await Cart.getItems();
        const container = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartLayout = document.querySelector('.cart-layout');

        if (!container) return;

        if (cartItems.length === 0) {
            if (cartLayout) cartLayout.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (cartLayout) cartLayout.style.display = 'grid';
        if (emptyCart) emptyCart.style.display = 'none';
    
    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                <strong>${formatCurrency(item.total)}</strong>
            </div>
        </div>
    `).join('');

        updateCartSummary();
    } catch (error) {
        console.error('خطأ في تحميل السلة:', error);
        showNotification('خطأ في تحميل السلة', 'error');
    }
}

// Show Delete Confirmation Modal
function showDeleteConfirmation(productId, productName) {
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.innerHTML = `
        <div class="delete-confirmation-content">
            <div class="delete-confirmation-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>تأكيد الحذف</h3>
            </div>
            <div class="delete-confirmation-body">
                <p>هل تريدين حذف <strong>${productName}</strong> من السلة؟</p>
                <p class="delete-confirmation-warning">لا يمكن التراجع عن هذا الإجراء</p>
            </div>
            <div class="delete-confirmation-actions">
                <button class="btn btn-secondary" onclick="closeDeleteConfirmation()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
                <button class="btn btn-danger" onclick="confirmDelete('${productId}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDeleteConfirmation();
        }
    });

    // Close modal with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeDeleteConfirmation();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Close Delete Confirmation Modal
function closeDeleteConfirmation() {
    const modal = document.querySelector('.delete-confirmation-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// Confirm Delete
function confirmDelete(productId) {
    Cart.remove(productId);
    closeDeleteConfirmation();
    loadCartItems();
    showNotification('تم حذف المنتج من السلة', 'success');
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        const cartItems = Cart.getItems();
        const item = cartItems.find(i => i.id === productId);
        showDeleteConfirmation(productId, item?.name || 'المنتج');
        return;
    }

    Cart.updateQuantity(productId, newQuantity);
    loadCartItems();
}

// Remove Item
function removeItem(productId) {
    const cartItems = Cart.getItems();
    const item = cartItems.find(i => i.id === productId);
    showDeleteConfirmation(productId, item?.name || 'المنتج');
}

// Update Cart Summary
async function updateCartSummary() {
    try {
        const subtotal = await Cart.getTotal();
        const shipping = 0; // Free shipping
        const discount = parseFloat(localStorage.getItem('cartDiscount') || 0);
        const total = subtotal + shipping - discount;

        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');
        const discountRowEl = document.getElementById('discountRow');
        const discountEl = document.getElementById('discount');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'مجاني' : formatCurrency(shipping);
        if (totalEl) totalEl.textContent = formatCurrency(total);

        if (discount > 0) {
            if (discountRowEl) discountRowEl.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-${formatCurrency(discount)}`;
        } else {
            if (discountRowEl) discountRowEl.style.display = 'none';
        }
    } catch (error) {
        console.error('خطأ في تحديث ملخص السلة:', error);
    }
}

// Apply Coupon
async function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const couponCode = couponInput.value.trim().toUpperCase();

    if (!couponCode) {
        showNotification('الرجاء إدخال كود الخصم', 'error');
        return;
    }

    try {
        const coupons = await StorageManager.getCoupons();
        const coupon = coupons.find(c => c.code === couponCode);

        if (!coupon) {
            showNotification('كود الخصم غير صحيح', 'error');
            return;
        }

        const subtotal = await Cart.getTotal();
        let discount = 0;

        if (coupon.discount_type === 'percentage') {
            discount = (subtotal * coupon.discount_value) / 100;
        } else {
            discount = coupon.discount_value;
        }

        localStorage.setItem('cartDiscount', discount);
        localStorage.setItem('appliedCoupon', couponCode);

        // عرض الكود المطبق
        const appliedCouponDisplay = document.getElementById('appliedCouponDisplay');
        const appliedCouponCode = document.getElementById('appliedCouponCode');
        if (appliedCouponDisplay && appliedCouponCode) {
            appliedCouponCode.textContent = couponCode;
            appliedCouponDisplay.style.display = 'block';
        }

        await updateCartSummary();
        showNotification(`تم تطبيق كود الخصم! وفرتي ${formatCurrency(discount)}`, 'success');
        couponInput.value = '';
    } catch (error) {
        console.error('خطأ في تطبيق الكوبون:', error);
        showNotification('حدث خطأ في تطبيق الكوبون', 'error');
    }
}

// Proceed to Checkout
async function proceedToCheckout() {
    try {
        const cartItems = await Cart.getItems();

        if (cartItems.length === 0) {
            showNotification('السلة فارغة!', 'error');
            return;
        }

        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('خطأ في الانتقال للدفع:', error);
        showNotification('حدث خطأ', 'error');
    }
}

// Display Applied Coupon on Load
function displayAppliedCoupon() {
    const appliedCoupon = localStorage.getItem('appliedCoupon');
    const appliedCouponDisplay = document.getElementById('appliedCouponDisplay');
    const appliedCouponCode = document.getElementById('appliedCouponCode');

    if (appliedCoupon && appliedCouponDisplay && appliedCouponCode) {
        appliedCouponCode.textContent = appliedCoupon;
        appliedCouponDisplay.style.display = 'block';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadCartItems();
    displayAppliedCoupon();

    // Apply coupon button
    const applyCouponBtn = document.getElementById('applyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Coupon input enter key
    const couponInput = document.getElementById('couponInput');
    if (couponInput) {
        couponInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
});

