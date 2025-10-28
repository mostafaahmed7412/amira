// ===== Checkout Page Script =====

let currentStep = 1;
let orderData = {
    shipping: {},
    payment: 'cod',
    items: [],
    total: 0
};

// Load Order Summary
async function loadOrderSummary() {
    try {
        const items = await Cart.getItems();
        const container = document.getElementById('summaryItems');

        if (!container) return;

        if (items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-price">${formatCurrency(item.price)} × ${item.quantity}</div>
                </div>
            </div>
        `).join('');

        await updateSummaryTotals();
    } catch (error) {
        console.error('خطأ في تحميل ملخص الطلب:', error);
        showNotification('خطأ في تحميل الطلب', 'error');
    }
}

// Update Summary Totals
async function updateSummaryTotals() {
    try {
        const subtotal = await Cart.getTotal();
        const shipping = 0;
        const discount = parseFloat(localStorage.getItem('cartDiscount') || 0);
        const appliedCoupon = localStorage.getItem('appliedCoupon');
        const total = subtotal + shipping - discount;

        const subtotalEl = document.getElementById('summarySubtotal');
        const shippingEl = document.getElementById('summaryShipping');
        const totalEl = document.getElementById('summaryTotal');
        const discountRowEl = document.getElementById('summaryDiscountRow');
        const discountEl = document.getElementById('summaryDiscount');
        const appliedCouponDisplay = document.getElementById('summaryAppliedCoupon');
        const appliedCouponCode = document.getElementById('summaryAppliedCouponCode');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'مجاني' : formatCurrency(shipping);
        if (totalEl) totalEl.textContent = formatCurrency(total);

        // عرض الخصم والكود المطبق
        if (discount > 0) {
            if (discountRowEl) discountRowEl.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-${formatCurrency(discount)}`;

            if (appliedCoupon && appliedCouponDisplay && appliedCouponCode) {
                appliedCouponCode.textContent = appliedCoupon;
                appliedCouponDisplay.style.display = 'block';
            }
        } else {
            if (discountRowEl) discountRowEl.style.display = 'none';
            if (appliedCouponDisplay) appliedCouponDisplay.style.display = 'none';
        }

        orderData.total = total;
        orderData.items = await Cart.getItems();
    } catch (error) {
        console.error('خطأ في تحديث إجمالي الملخص:', error);
    }
}

// Go to Payment Step
function goToPayment() {
    // Validate shipping information
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!fullName || !phone || !city || !address) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // Save shipping data
    orderData.shipping = {
        fullName,
        phone,
        email: document.getElementById('email').value.trim(),
        city,
        address,
        notes: document.getElementById('notes').value.trim()
    };
    
    // Move to payment step
    document.getElementById('shippingSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
    updateProgressSteps(2);
}

// Go to Confirmation Step
function goToConfirmation() {
    // Get selected payment method
    const paymentMethodInput = document.querySelector('input[name="payment"]:checked').value;

    // Map payment method values to database values
    const paymentMethodMap = {
        'cod': 'cash',
        'bank': 'bank_transfer',
        'online': 'online'
    };

    orderData.payment = paymentMethodMap[paymentMethodInput] || paymentMethodInput;

    // Display review information
    displayReviewInfo();

    // Move to confirmation step
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmSection').style.display = 'block';
    updateProgressSteps(3);
}

// Display Review Information
function displayReviewInfo() {
    // Shipping info
    const shippingHTML = `
        <p><strong>الاسم:</strong> ${orderData.shipping.fullName}</p>
        <p><strong>الجوال:</strong> ${orderData.shipping.phone}</p>
        ${orderData.shipping.email ? `<p><strong>البريد:</strong> ${orderData.shipping.email}</p>` : ''}
        <p><strong>المدينة:</strong> ${orderData.shipping.city}</p>
        <p><strong>العنوان:</strong> ${orderData.shipping.address}</p>
        ${orderData.shipping.notes ? `<p><strong>ملاحظات:</strong> ${orderData.shipping.notes}</p>` : ''}
    `;
    document.getElementById('reviewShipping').innerHTML = shippingHTML;
    
    // Payment info
    const paymentMethods = {
        'cod': 'الدفع عند الاستلام',
        'bank': 'تحويل بنكي',
        'online': 'الدفع الإلكتروني'
    };
    document.getElementById('reviewPayment').innerHTML = `<p>${paymentMethods[orderData.payment]}</p>`;
    
    // Items
    const itemsHTML = orderData.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${formatCurrency(item.total)}</span>
        </div>
    `).join('');
    document.getElementById('reviewItems').innerHTML = itemsHTML + `
        <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--border-color); font-weight: bold; color: var(--primary-color);">
            <span>الإجمالي:</span>
            <span>${formatCurrency(orderData.total)}</span>
        </div>
    `;
}

// Back to Shipping
function backToShipping() {
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('shippingSection').style.display = 'block';
    updateProgressSteps(1);
}

// Back to Payment
function backToPayment() {
    document.getElementById('confirmSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
    updateProgressSteps(2);
}

// Update Progress Steps
function updateProgressSteps(step) {
    currentStep = step;
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Submit Order
async function submitOrder(e) {
    e.preventDefault();

    try {
        // Create order object for Supabase
        const order = {
            full_name: orderData.shipping.fullName,
            phone: orderData.shipping.phone,
            address: orderData.shipping.address,
            total_amount: orderData.total,
            status: 'pending',
            payment_method: orderData.payment,
            payment_status: 'pending',
            notes: `Items: ${orderData.items.length}, Coupon: ${localStorage.getItem('appliedCoupon') || 'None'}`
        };

        // Save order to Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([order])
            .select();

        if (error) {
            throw error;
        }

        const orderId = data[0].id;

        // Clear cart and discount
        Cart.clear();
        localStorage.removeItem('cartDiscount');
        localStorage.removeItem('appliedCoupon');

        // Redirect to success page
        window.location.href = `order-success.html?orderId=${orderId}`;
    } catch (error) {
        console.error('خطأ في حفظ الطلب:', error);
        showNotification('حدث خطأ في معالجة الطلب. حاولي لاحقاً', 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadOrderSummary();
    
    // Next to payment button
    const nextToPaymentBtn = document.getElementById('nextToPayment');
    if (nextToPaymentBtn) {
        nextToPaymentBtn.addEventListener('click', goToPayment);
    }
    
    // Next to confirm button
    const nextToConfirmBtn = document.getElementById('nextToConfirm');
    if (nextToConfirmBtn) {
        nextToConfirmBtn.addEventListener('click', goToConfirmation);
    }
    
    // Back buttons
    const backToShippingBtn = document.getElementById('backToShipping');
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', backToShipping);
    }
    
    const backToPaymentBtn = document.getElementById('backToPayment');
    if (backToPaymentBtn) {
        backToPaymentBtn.addEventListener('click', backToPayment);
    }
    
    // Form submit
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', submitOrder);
    }
});

