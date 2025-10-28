// ===== Storage Manager (Hybrid: Supabase + LocalStorage) =====
const StorageManager = {
    // Products - من Supabase
    getProducts: async () => {
        try {
            const result = await SupabaseDB.getProducts();
            return result.success ? result.data : [];
        } catch (error) {
            console.error('خطأ في جلب المنتجات:', error);
            return [];
        }
    },

    setProducts: (products) => {
        // لا نحتاج لحفظ في localStorage عند استخدام Supabase
        console.log('المنتجات محفوظة في Supabase');
    },

    // Cart - محلي (localStorage)
    getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
    setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),

    // Orders - من Supabase
    getOrders: async () => {
        try {
            const { data, error } = await supabaseClient
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            return error ? [] : (data || []);
        } catch (error) {
            console.error('خطأ في جلب الطلبات:', error);
            return [];
        }
    },

    setOrders: (orders) => {
        console.log('الطلبات محفوظة في Supabase');
    },

    // Coupons - من Supabase
    getCoupons: async () => {
        try {
            const { data, error } = await supabaseClient
                .from('coupons')
                .select('*')
                .eq('is_active', true);
            return error ? [] : (data || []);
        } catch (error) {
            console.error('خطأ في جلب الكوبونات:', error);
            return [];
        }
    },

    setCoupons: (coupons) => {
        console.log('الكوبونات محفوظة في Supabase');
    },

    // Admin - محلي (localStorage)
    getAdmin: () => JSON.parse(localStorage.getItem('admin')) || { username: 'admin', password: 'admin123' },
    setAdmin: (admin) => localStorage.setItem('admin', JSON.stringify(admin)),

    // Check if logged in
    isLoggedIn: () => localStorage.getItem('isLoggedIn') === 'true',
    setLoggedIn: (status) => localStorage.setItem('isLoggedIn', status)
};

// ===== Migrate Old Orders Data =====
async function migrateOrdersData() {
    try {
        const orders = await StorageManager.getOrders();
        if (!Array.isArray(orders) || orders.length === 0) {
            return;
        }

        const updatedOrders = orders.map(order => {
            // Ensure all required fields exist
            return {
                id: order.id || 'ORD-' + Date.now(),
                date: order.date || new Date().toISOString(),
                status: order.status || 'pending',
                shipping: order.shipping || {},
                paymentMethod: order.paymentMethod || order.payment || 'cod',
                items: order.items || [],
                subtotal: order.subtotal || 0,
                discount: order.discount || 0,
                shippingCost: order.shippingCost || 0,
                total: order.total || 0,
                coupon: order.coupon || null
            };
        });

        if (updatedOrders.length > 0) {
            StorageManager.setOrders(updatedOrders);
        }
    } catch (error) {
        console.error('خطأ في ترحيل بيانات الطلبات:', error);
    }
}

// ===== Initialize Sample Data =====
async function initializeSampleData() {
    // Migrate old orders data
    await migrateOrdersData();

    // جلب المنتجات من Supabase
    const products = await StorageManager.getProducts();

    // إذا لم توجد منتجات، أضف منتجات تجريبية
    if (products.length === 0) {
        // Category IDs from Supabase
        const CATEGORY_IDS = {
            accessories: '4a2f6114-39ba-4ffa-9276-a31584d89639',
            decor: 'b1ebc344-d533-4b66-84ef-94590572c9fe',
            gifts: 'd90cb589-85f0-4770-8af5-cd78983c2125',
            handmade: '0eed0e27-5544-49d6-81f2-7fc8f45583b1'
        };

        const sampleProducts = [
            {
                name: 'كوب زهري مميز',
                price: 150,
                category_id: CATEGORY_IDS.accessories,
                image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
                description: 'كوب خزفي بتصميم زهري أنيق مصنوع يدويًا',
                is_featured: true,
                stock_quantity: 15
            },
            {
                name: 'مجموعة مجات ورود',
                price: 400,
                category_id: CATEGORY_IDS.accessories,
                image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400',
                description: 'مجموعة من 3 مجات بتصاميم ورود مختلفة',
                is_featured: true,
                stock_quantity: 8
            },
            {
                name: 'فازة ديكور أنيقة',
                price: 280,
                category_id: CATEGORY_IDS.decor,
                image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
                description: 'فازة خزفية مصنوعة يدويًا بألوان هادئة',
                is_featured: false,
                stock_quantity: 12
            },
            {
                name: 'باقة ورد مجفف',
                price: 220,
                category_id: CATEGORY_IDS.handmade,
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
                description: 'باقة ورد مجفف طبيعي بألوان جميلة',
                is_featured: true,
                stock_quantity: 20
            },
            {
                name: 'صندوق هدايا فاخر',
                price: 320,
                category_id: CATEGORY_IDS.gifts,
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
                description: 'صندوق هدايا مزين بالورود والشرائط',
                is_featured: false,
                stock_quantity: 10
            },
            {
                name: 'كوب قهوة عصري',
                price: 180,
                category_id: CATEGORY_IDS.accessories,
                image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
                description: 'كوب قهوة بتصميم عصري وألوان جذابة',
                is_featured: false,
                stock_quantity: 18
            },
            {
                name: 'لوحة ديكور يدوية',
                price: 500,
                category_id: CATEGORY_IDS.decor,
                image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400',
                description: 'لوحة ديكور مرسومة يدويًا بتصميم فريد',
                is_featured: true,
                stock_quantity: 5
            },
            {
                name: 'مجموعة شموع معطرة',
                price: 250,
                category_id: CATEGORY_IDS.decor,
                image: 'https://images.unsplash.com/photo-1602874801006-95415c52e0e6?w=400',
                description: 'مجموعة شموع معطرة بروائح طبيعية',
                is_featured: false,
                stock_quantity: 25
            }
        ];

        // إضافة المنتجات إلى Supabase
        for (const product of sampleProducts) {
            try {
                await SupabaseDB.addProduct({
                    name: product.name,
                    name_ar: product.name,
                    description: product.description,
                    price: product.price,
                    category_id: product.category_id,
                    image_url: product.image,
                    stock_quantity: product.stock_quantity,
                    is_featured: product.is_featured,
                    is_active: true
                });
            } catch (error) {
                console.error('خطأ في إضافة المنتج:', error);
            }
        }
    }
}

// ===== Cart Functions =====
const Cart = {
    add: (productId, quantity = 1) => {
        const cart = StorageManager.getCart();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        
        StorageManager.setCart(cart);
        updateCartCount();
        showNotification('تمت الإضافة إلى السلة بنجاح!', 'success');
    },
    
    remove: (productId) => {
        let cart = StorageManager.getCart();
        cart = cart.filter(item => item.productId !== productId);
        StorageManager.setCart(cart);
        updateCartCount();
    },
    
    updateQuantity: (productId, quantity) => {
        const cart = StorageManager.getCart();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                Cart.remove(productId);
            } else {
                StorageManager.setCart(cart);
            }
        }
        updateCartCount();
    },
    
    clear: () => {
        StorageManager.setCart([]);
        updateCartCount();
    },
    
    getItems: async () => {
        const cart = StorageManager.getCart();
        const products = await StorageManager.getProducts();

        return cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                console.warn(`Product with ID ${item.productId} not found`);
                return null;
            }
            return {
                ...product,
                quantity: item.quantity,
                total: product.price * item.quantity
            };
        }).filter(item => item !== null);
    },
    
    getTotal: async () => {
        const items = await Cart.getItems();
        return items.reduce((sum, item) => sum + item.total, 0);
    },
    
    getCount: () => {
        const cart = StorageManager.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
};

// ===== Update Cart Count =====
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = Cart.getCount();
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.8rem;
                z-index: 10000;
                animation: slideInRight 0.4s ease;
                font-weight: 600;
                min-width: 300px;
            }

            .notification.success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-left: 4px solid #047857;
            }

            .notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border-left: 4px solid #b91c1c;
            }

            .notification.info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border-left: 4px solid #1d4ed8;
            }

            .notification i {
                font-size: 1.3rem;
                flex-shrink: 0;
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== Format Currency =====
function formatCurrency(amount) {
    return `${amount.toFixed(2)} ج.م`;
}

// ===== Initialize on page load =====
document.addEventListener('DOMContentLoaded', () => {
    // تنظيف السلة من العناصر المحذوفة
    cleanCart();

    initializeSampleData();
    updateCartCount();

    // Category cards click handler
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
});

// ===== Clean Cart =====
async function cleanCart() {
    try {
        const cart = StorageManager.getCart();
        const products = await StorageManager.getProducts();
        const productIds = products.map(p => p.id);

        // إزالة العناصر التي لا توجد منتجات لها
        const cleanedCart = cart.filter(item => productIds.includes(item.productId));

        if (cleanedCart.length !== cart.length) {
            StorageManager.setCart(cleanedCart);
            updateCartCount();
        }
    } catch (error) {
        console.error('خطأ في تنظيف السلة:', error);
    }
}

// ===== Admin Access Control =====
let logoTapCount = 0;
let logoTapTimeout;

// اختصار لوحة المفاتيح: Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        goToAdminLogin();
    }
});

// الضغط على الشعار 3 مرات بسرعة (للهاتف والكمبيوتر)
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            logoTapCount++;

            // إعادة تعيين العداد بعد 1 ثانية
            clearTimeout(logoTapTimeout);
            logoTapTimeout = setTimeout(() => {
                logoTapCount = 0;
            }, 1000);

            // إذا تم الضغط 3 مرات، انتقل إلى لوحة التحكم
            if (logoTapCount === 3) {
                logoTapCount = 0;
                goToAdminLogin();
            }
        });
    }
});

function goToAdminLogin() {
    // التحقق من وجود صفحة تسجيل الدخول
    const adminPath = window.location.pathname.includes('/admin/') ? 'login.html' : 'admin/login.html';
    window.location.href = adminPath;
}

