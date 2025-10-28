// ===== Admin Dashboard Script =====

// Check if logged in
function checkLogin() {
    if (!StorageManager.isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Logout
function logout() {
    if (confirm('هل تريدين تسجيل الخروج؟')) {
        StorageManager.setLoggedIn(false);
        window.location.href = 'login.html';
    }
}

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        // جلب البيانات من Supabase
        const orders = await StorageManager.getOrders();
        const products = await StorageManager.getProducts();

        // جلب الرسائل من Supabase
        const { data: messages } = await supabaseClient
            .from('contact_messages')
            .select('*');

        // Calculate stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const totalProducts = products.length;
        const newMessages = (messages || []).filter(m => m.status === 'new').length;

        // Update stats
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const totalProductsEl = document.getElementById('totalProducts');
        const totalMessagesEl = document.getElementById('totalMessages');

        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
        if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue);
        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        if (totalMessagesEl) totalMessagesEl.textContent = newMessages;

        // Load recent orders
        await loadRecentOrders();
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// Load Recent Orders
async function loadRecentOrders() {
    try {
        const orders = await StorageManager.getOrders();
        const recentOrders = orders.slice(-5).reverse();
        const container = document.getElementById('recentOrdersList');

        if (!container) return;

        if (recentOrders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-color);">لا توجد طلبات حتى الآن</p>';
            return;
        }

        container.innerHTML = recentOrders.map(order => `
            <div class="order-item" onclick="viewOrderDetails('${order.id || ''}')" style="cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.backgroundColor='var(--light-color)'" onmouseout="this.style.backgroundColor='transparent'">
                <div class="order-info">
                    <div class="order-id">${order.id || 'غير محدد'}</div>
                    <div class="order-customer">${order.full_name || 'غير محدد'} - ${order.phone || 'غير محدد'}</div>
                </div>
                <div style="text-align: left;">
                    <div style="font-weight: bold; color: var(--primary-color);">${formatCurrency(order.total_amount || 0)}</div>
                    <span class="order-status status-${order.status}">${getStatusLabel(order.status)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل الطلبات:', error);
    }
}

// Toggle Status Menu
function toggleStatusMenu(event, orderId) {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${orderId}`);
    const isVisible = menu.style.display === 'block';

    // Close all other menus
    document.querySelectorAll('.status-menu').forEach(m => {
        m.style.display = 'none';
    });

    // Toggle current menu
    menu.style.display = isVisible ? 'none' : 'block';
}

// Close menu when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.status-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});

// Get Category Name
function getCategoryName(categoryId) {
    const categoryMap = {
        '4a2f6114-39ba-4ffa-9276-a31584d89639': 'كوبيات ومجات',
        'b1ebc344-d533-4b66-84ef-94590572c9fe': 'ديكورات',
        'd90cb589-85f0-4770-8af5-cd78983c2125': 'هدايا',
        '0eed0e27-5544-49d6-81f2-7fc8f45583b1': 'ورد مجفف',
        'cups': 'كوبيات ومجات',
        'decor': 'ديكورات',
        'gifts': 'هدايا',
        'flowers': 'ورد مجفف'
    };
    return categoryMap[categoryId] || 'غير محدد';
}

// Get Status Label
function getStatusLabel(status) {
    const labels = {
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل'
    };
    return labels[status] || status;
}

// Load Products (Admin - جميع المنتجات)
async function loadProducts() {
    try {
        // جلب جميع المنتجات من Supabase (بما فيها غير النشطة)
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // تحويل البيانات
        const products = (data || []).map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category_id,
            category_id: product.category_id,
            image: product.image_url,
            image_url: product.image_url,
            stock: product.stock_quantity,
            stock_quantity: product.stock_quantity,
            featured: product.is_featured,
            is_featured: product.is_featured,
            new: product.is_active,
            is_active: product.is_active
        }));

        const container = document.getElementById('productsList');

        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-color);">لا توجد منتجات</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <img src="${product.image || product.image_url || ''}" alt="${product.name || 'منتج'}" class="product-image">
                    <div class="product-details">
                        <h4>${product.name || 'غير محدد'}</h4>
                        <p>${getCategoryName(product.category || product.category_id) || 'غير محدد'} - ${formatCurrency(product.price || 0)}</p>
                        <p>المخزون: ${product.stock || product.stock_quantity || 0}</p>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="editProduct('${product.id || ''}')">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-secondary" onclick="deleteProduct('${product.id || ''}', '${product.image || product.image_url || ''}')" style="background: #ffebee; color: var(--danger-color);">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
    }
}

// Load Orders
async function loadOrders() {
    try {
        const orders = await StorageManager.getOrders();
        const container = document.getElementById('ordersList');

        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-color);">لا توجد طلبات</p>';
            return;
        }

        container.innerHTML = orders.reverse().map(order => {
            const statusColors = {
                'pending': { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', label: 'قيد الانتظار' },
                'processing': { bg: '#cfe2ff', color: '#084298', icon: 'fa-spinner', label: 'قيد المعالجة' },
                'completed': { bg: '#d1e7dd', color: '#0f5132', icon: 'fa-check-circle', label: 'مكتمل' }
            };
            const currentStatus = statusColors[order.status] || statusColors['pending'];

            return `
            <div class="order-item">
                <div class="order-info" onclick="viewOrderDetails('${order.id}')" style="cursor: pointer; flex: 1;">
                    <div class="order-id">${order.id || 'غير محدد'}</div>
                    <div class="order-customer">${order.full_name || 'غير محدد'}</div>
                    <div style="color: var(--gray-color); font-size: 0.85rem;">${order.phone || 'غير محدد'}</div>
                    <div style="color: var(--gray-color); font-size: 0.8rem; margin-top: 0.3rem;">
                        ${order.created_at ? new Date(order.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </div>
                </div>
                <div style="text-align: left; display: flex; align-items: center; gap: 1rem;">
                    <div style="font-weight: bold; color: var(--primary-color);">${formatCurrency(order.total_amount || 0)}</div>
                    <div class="status-badge" style="background: ${currentStatus.bg}; color: ${currentStatus.color}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; min-width: 140px; justify-content: center;">
                        <i class="fas ${currentStatus.icon}"></i>
                        ${currentStatus.label}
                    </div>
                    <div class="status-dropdown" style="position: relative;">
                        <button class="status-btn" onclick="toggleStatusMenu(event, '${order.id}')" style="background: var(--primary-color); color: white; border: none; padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-chevron-down"></i> تغيير
                        </button>
                        <div class="status-menu" id="menu-${order.id}" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 2px solid var(--primary-color); border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); z-index: 1000; min-width: 180px; overflow: hidden;">
                            <button onclick="updateOrderStatus('${order.id}', 'pending'); toggleStatusMenu(event, '${order.id}')" style="width: 100%; padding: 0.8rem 1rem; background: none; border: none; text-align: right; cursor: pointer; transition: all 0.3s ease; border-bottom: 1px solid var(--border-color);" onmouseover="this.style.backgroundColor='var(--light-color)'" onmouseout="this.style.backgroundColor='transparent'">
                                <i class="fas fa-clock" style="color: #856404; margin-left: 0.5rem;"></i> قيد الانتظار
                            </button>
                            <button onclick="updateOrderStatus('${order.id}', 'processing'); toggleStatusMenu(event, '${order.id}')" style="width: 100%; padding: 0.8rem 1rem; background: none; border: none; text-align: right; cursor: pointer; transition: all 0.3s ease; border-bottom: 1px solid var(--border-color);" onmouseover="this.style.backgroundColor='var(--light-color)'" onmouseout="this.style.backgroundColor='transparent'">
                                <i class="fas fa-spinner" style="color: #084298; margin-left: 0.5rem;"></i> قيد المعالجة
                            </button>
                            <button onclick="updateOrderStatus('${order.id}', 'completed'); toggleStatusMenu(event, '${order.id}')" style="width: 100%; padding: 0.8rem 1rem; background: none; border: none; text-align: right; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.backgroundColor='var(--light-color)'" onmouseout="this.style.backgroundColor='transparent'">
                                <i class="fas fa-check-circle" style="color: #0f5132; margin-left: 0.5rem;"></i> مكتمل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');
    } catch (error) {
        console.error('خطأ في تحميل الطلبات:', error);
    }
}

// View Order Details
async function viewOrderDetails(orderId) {
    try {
        const orders = await StorageManager.getOrders();
        const order = orders.find(o => o.id === orderId);

    if (!order) {
        showNotification('الطلب غير موجود', 'error');
        return;
    }

    const statusText = {
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل'
    };

    const paymentMethods = {
        'cod': 'الدفع عند الاستلام',
        'bank': 'تحويل بنكي',
        'online': 'الدفع الإلكتروني'
    };

    const itemsHTML = (order.items || []).map(item => `
        <tr>
            <td>${item.name || 'غير محدد'}</td>
            <td>${item.quantity || 0}</td>
            <td>${formatCurrency(item.price || 0)}</td>
            <td>${formatCurrency((item.quantity || 0) * (item.price || 0))}</td>
        </tr>
    `).join('');

    const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;" onclick="this.remove()">
            <div style="background: white; border-radius: 15px; padding: 2rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: var(--primary-color);">تفاصيل الطلب</h3>
                    <button onclick="this.closest('[style*=position]').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>

                <div style="background: var(--light-color); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p><strong>رقم الطلب:</strong> ${order.id || 'غير محدد'}</p>
                    <p><strong>التاريخ:</strong> ${order.date ? new Date(order.date).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
                    <p><strong>الحالة:</strong> <span style="background: var(--primary-color); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">${statusText[order.status] || 'غير محدد'}</span></p>
                </div>

                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">بيانات العميل</h4>
                <div style="background: var(--light-color); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p><strong>الاسم:</strong> ${order.shipping?.fullName || 'غير محدد'}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${order.shipping?.email || 'غير محدد'}</p>
                    <p><strong>الهاتف:</strong> ${order.shipping?.phone || 'غير محدد'}</p>
                    <p><strong>العنوان:</strong> ${order.shipping?.address || 'غير محدد'}</p>
                    <p><strong>المدينة:</strong> ${order.shipping?.city || 'غير محدد'}</p>
                </div>

                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">طريقة الدفع</h4>
                <div style="background: var(--light-color); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p><strong>طريقة الدفع:</strong> ${paymentMethods[order.paymentMethod] || (order.payment ? paymentMethods[order.payment] : 'غير محدد')}</p>
                </div>

                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">المنتجات</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <thead>
                        <tr style="background: var(--light-color);">
                            <th style="padding: 0.8rem; text-align: right; border-bottom: 2px solid var(--border-color);">المنتج</th>
                            <th style="padding: 0.8rem; text-align: center; border-bottom: 2px solid var(--border-color);">الكمية</th>
                            <th style="padding: 0.8rem; text-align: center; border-bottom: 2px solid var(--border-color);">السعر</th>
                            <th style="padding: 0.8rem; text-align: center; border-bottom: 2px solid var(--border-color);">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div style="background: var(--light-color); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p style="display: flex; justify-content: space-between; margin: 0.5rem 0;"><strong>الإجمالي الفرعي:</strong> ${formatCurrency(order.subtotal || order.total || 0)}</p>
                    ${order.discount ? `<p style="display: flex; justify-content: space-between; margin: 0.5rem 0;"><strong>الخصم:</strong> -${formatCurrency(order.discount)}</p>` : ''}
                    <p style="display: flex; justify-content: space-between; margin: 0.5rem 0; font-size: 1.1rem; color: var(--primary-color);"><strong>الإجمالي:</strong> <strong>${formatCurrency(order.total || 0)}</strong></p>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button onclick="this.closest('[style*=position]').remove()" style="flex: 1; padding: 0.8rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">إغلاق</button>
                </div>
            </div>
        </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('خطأ في عرض تفاصيل الطلب:', error);
        showNotification('حدث خطأ في عرض تفاصيل الطلب', 'error');
    }
}

// Update Order Status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            throw error;
        }

        showNotification('تم تحديث حالة الطلب بنجاح ✓', 'success');

        // Reload orders list
        const currentSection = document.querySelector('.admin-section.active');
        if (currentSection) {
            const sectionId = currentSection.id;
            if (sectionId === 'orders-section') {
                await loadOrders();
            } else if (sectionId === 'dashboard-section') {
                await loadDashboardStats();
            }
        }
    } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error);
        showNotification('حدث خطأ في تحديث حالة الطلب', 'error');
    }
}

// Load Coupons
async function loadCoupons() {
    try {
        const { data: coupons } = await supabaseClient
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        const container = document.getElementById('couponsList');

        if (!container) return;

        if (!coupons || coupons.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-color);">لا توجد كوبونات</p>';
            return;
        }

        container.innerHTML = coupons.map((coupon) => `
            <div class="coupon-item">
                <div>
                    <strong>${coupon.code || 'غير محدد'}</strong>
                    <p style="color: var(--gray-color); margin: 0.3rem 0;">
                        ${coupon.discount_type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}: ${coupon.discount_value || 0}${coupon.discount_type === 'percentage' ? '%' : ' ج.م'}
                    </p>
                </div>
                <button class="btn btn-secondary" onclick="deleteCoupon('${coupon.id || ''}')" style="background: #ffebee; color: var(--danger-color);">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل الكوبونات:', error);
    }
}

// Load Messages
async function loadMessages() {
    try {
        const { data: messages } = await supabaseClient
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        const container = document.getElementById('messagesList');

        if (!container) return;

        if (!messages || messages.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-color);">لا توجد رسائل</p>';
            return;
        }

        container.innerHTML = messages.map((message) => `
            <div class="message-item">
                <div>
                    <strong>${message.name || 'غير محدد'}</strong>
                    <p style="color: var(--gray-color); margin: 0.3rem 0;">${message.subject || 'بدون موضوع'}</p>
                    <p style="color: var(--gray-color); margin: 0.3rem 0; font-size: 0.85rem;">${message.email || 'غير محدد'} - ${message.phone || 'غير محدد'}</p>
                </div>
                <button class="btn btn-secondary" onclick="deleteMessage('${message.id || ''}')" style="background: #ffebee; color: var(--danger-color);">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل الرسائل:', error);
    }
}

// Open Add Product Modal
function openAddProductModal() {
    // Navigate to add-product.html instead of opening a modal
    window.location.href = 'add-product.html';
}

// Close Product Modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();

    // إعادة تعيين النموذج للإضافة
    document.querySelector('#productModal h2').textContent = 'إضافة منتج جديد';
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    submitBtn.textContent = 'حفظ المنتج';
    submitBtn.dataset.productId = '';

    // إخفاء الصورة المعروضة
    document.getElementById('productImagePreview').style.display = 'none';
    document.getElementById('productImage').value = '';
}

// Open Add Coupon Modal
function openAddCouponModal() {
    document.getElementById('couponModal').classList.add('active');
}

// Close Coupon Modal
function closeCouponModal() {
    document.getElementById('couponModal').classList.remove('active');
    document.getElementById('couponForm').reset();
}

// Add Product
async function addProduct(e) {
    e.preventDefault();

    try {
        const imageUrl = document.getElementById('productImage').value;
        if (!imageUrl) {
            showNotification('الرجاء رفع صورة المنتج', 'error');
            return;
        }

        const categoryValue = document.getElementById('productCategory').value;

        // Map category names to UUIDs
        const categoryMap = {
            'cups': '4a2f6114-39ba-4ffa-9276-a31584d89639',
            'decor': 'b1ebc344-d533-4b66-84ef-94590572c9fe',
            'gifts': 'd90cb589-85f0-4770-8af5-cd78983c2125',
            'flowers': '0eed0e27-5544-49d6-81f2-7fc8f45583b1'
        };

        const categoryId = categoryMap[categoryValue] || categoryMap['cups'];

        const productName = document.getElementById('productName').value;
        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        const productId = submitBtn.dataset.productId;

        const productData = {
            name: productName,
            name_ar: productName,
            price: parseFloat(document.getElementById('productPrice').value),
            category_id: categoryId,
            description: document.getElementById('productDescription').value,
            image_url: imageUrl,
            stock_quantity: parseInt(document.getElementById('productStock').value),
            is_featured: document.getElementById('productFeatured').checked,
            is_active: true  // المنتج نشط بشكل افتراضي
        };

        let result;
        if (productId) {
            // تحديث المنتج
            result = await supabaseClient
                .from('products')
                .update(productData)
                .eq('id', productId)
                .select();
        } else {
            // إضافة منتج جديد
            result = await supabaseClient
                .from('products')
                .insert([productData])
                .select();
        }

        const { data, error } = result;

        if (error) {
            throw error;
        }

        closeProductModal();
        await loadProducts();
        const message = productId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح';
        showNotification(message, 'success');
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        showNotification('حدث خطأ في إضافة المنتج', 'error');
    }
}

// Edit Product
async function editProduct(productId) {
    try {
        // جلب بيانات المنتج
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            showNotification('المنتج غير موجود', 'error');
            return;
        }

        // ملء النموذج ببيانات المنتج
        document.getElementById('productName').value = data.name || '';
        document.getElementById('productPrice').value = data.price || '';
        document.getElementById('productCategory').value = getCategoryKeyFromId(data.category_id) || 'cups';
        document.getElementById('productDescription').value = data.description || '';
        document.getElementById('productStock').value = data.stock_quantity || '';
        document.getElementById('productFeatured').checked = data.is_featured || false;
        document.getElementById('productNew').checked = data.is_active || false;

        // عرض الصورة الحالية
        if (data.image_url) {
            document.getElementById('productImagePreview').src = data.image_url;
            document.getElementById('productImagePreview').style.display = 'block';
            document.getElementById('productImage').value = data.image_url;
        }

        // تغيير عنوان النموذج
        document.querySelector('#productModal h2').textContent = 'تعديل المنتج';

        // تغيير زر الحفظ
        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        submitBtn.textContent = 'تحديث المنتج';
        submitBtn.dataset.productId = productId;

        // فتح النموذج
        document.getElementById('productModal').classList.add('active');
    } catch (error) {
        console.error('خطأ في تحميل بيانات المنتج:', error);
        showNotification('حدث خطأ في تحميل بيانات المنتج', 'error');
    }
}

// Get Category Key from ID
function getCategoryKeyFromId(categoryId) {
    const categoryMap = {
        '4a2f6114-39ba-4ffa-9276-a31584d89639': 'cups',
        'b1ebc344-d533-4b66-84ef-94590572c9fe': 'decor',
        'd90cb589-85f0-4770-8af5-cd78983c2125': 'gifts',
        '0eed0e27-5544-49d6-81f2-7fc8f45583b1': 'flowers'
    };
    return categoryMap[categoryId] || 'cups';
}

// Delete Product
async function deleteProduct(productId, imageUrl) {
    if (confirm('هل تريدين حذف هذا المنتج؟')) {
        try {
            // حذف من Supabase
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) {
                throw error;
            }

            // حذف الصورة من Storage إذا كانت موجودة
            if (imageUrl && imageUrl.includes('supabase')) {
                try {
                    const filePath = imageUrl.split('/').pop();
                    await supabaseClient.storage
                        .from('products')
                        .remove([filePath]);
                } catch (storageError) {
                    console.warn('خطأ في حذف الصورة:', storageError);
                }
            }

            await loadProducts();
            showNotification('تم حذف المنتج', 'success');
        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            showNotification('حدث خطأ في حذف المنتج', 'error');
        }
    }
}

// Add Coupon
async function addCoupon(e) {
    e.preventDefault();

    try {
        const newCoupon = {
            code: document.getElementById('couponCode').value.toUpperCase(),
            discount_type: document.getElementById('couponType').value,
            discount_value: parseFloat(document.getElementById('couponDiscount').value),
            is_active: true
        };

        const { data, error } = await supabaseClient
            .from('coupons')
            .insert([newCoupon])
            .select();

        if (error) {
            console.error('تفاصيل الخطأ:', error);
            throw error;
        }

        closeCouponModal();
        await loadCoupons();
        showNotification('تم إضافة الكوبون بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في إضافة الكوبون:', error);
        const errorMessage = error.message || 'حدث خطأ في إضافة الكوبون';
        showNotification(errorMessage, 'error');
    }
}

// Delete Coupon
async function deleteCoupon(couponId) {
    if (confirm('هل تريدين حذف هذا الكوبون؟')) {
        try {
            const { error } = await supabaseClient
                .from('coupons')
                .delete()
                .eq('id', couponId);

            if (error) {
                throw error;
            }

            await loadCoupons();
            showNotification('تم حذف الكوبون', 'success');
        } catch (error) {
            console.error('خطأ في حذف الكوبون:', error);
            showNotification('حدث خطأ في حذف الكوبون', 'error');
        }
    }
}

// Delete Message
async function deleteMessage(messageId) {
    if (confirm('هل تريدين حذف هذه الرسالة؟')) {
        try {
            const { error } = await supabaseClient
                .from('contact_messages')
                .delete()
                .eq('id', messageId);

            if (error) {
                throw error;
            }

            await loadMessages();
            showNotification('تم حذف الرسالة', 'success');
        } catch (error) {
            console.error('خطأ في حذف الرسالة:', error);
            showNotification('حدث خطأ في حذف الرسالة', 'error');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    checkLogin();

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show selected section
            const section = link.dataset.section;
            const sectionElement = document.getElementById(`${section}-section`);
            if (sectionElement) {
                sectionElement.classList.add('active');

                // Load data for section
                if (section === 'dashboard') {
                    await loadDashboardStats();
                } else if (section === 'products') {
                    await loadProducts();
                } else if (section === 'orders') {
                    await loadOrders();
                } else if (section === 'coupons') {
                    await loadCoupons();
                } else if (section === 'messages') {
                    await loadMessages();
                }
            }
        });
    });

    // Form submissions
    document.getElementById('productForm').addEventListener('submit', addProduct);
    document.getElementById('couponForm').addEventListener('submit', addCoupon);

    // Load initial dashboard
    await loadDashboardStats();
});

