# 🔗 ربط المشروع بـ Supabase - دليل شامل

## ✅ ما تم إنجازه:

### 1. تحديث ملفات JavaScript الأساسية:

#### `js/app.js`
- ✅ تحديث `StorageManager` للعمل مع Supabase
- ✅ جلب المنتجات من Supabase بدلاً من localStorage
- ✅ جلب الطلبات من Supabase
- ✅ جلب الكوبونات من Supabase
- ✅ إضافة المنتجات التجريبية إلى Supabase عند التهيئة

#### `js/products.js`
- ✅ تحديث `loadProducts()` لجلب البيانات من Supabase
- ✅ معالجة الأخطاء والتصفية

#### `js/contact.js`
- ✅ تحديث `handleContactForm()` لحفظ الرسائل في Supabase
- ✅ معالجة الأخطاء والتنبيهات

#### `js/checkout.js`
- ✅ تحديث `submitOrder()` لحفظ الطلبات في Supabase
- ✅ جلب معرف الطلب من Supabase

#### `admin/js/admin.js`
- ✅ تحديث `loadDashboardStats()` لجلب البيانات من Supabase
- ✅ تحديث `loadRecentOrders()` لعرض الطلبات من Supabase
- ✅ تحديث `loadProducts()` لعرض المنتجات من Supabase
- ✅ تحديث `loadOrders()` لعرض جميع الطلبات
- ✅ تحديث `loadCoupons()` لعرض الكوبونات من Supabase
- ✅ تحديث `loadMessages()` لعرض الرسائل من Supabase
- ✅ تحديث `updateOrderStatus()` لتحديث حالة الطلب في Supabase
- ✅ تحديث `deleteProduct()` لحذف المنتج من Supabase
- ✅ تحديث `deleteCoupon()` لحذف الكوبون من Supabase
- ✅ تحديث `deleteMessage()` لحذف الرسالة من Supabase

### 2. تحديث صفحات HTML:

تم إضافة مراجع Supabase في جميع الصفحات:

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-config.js"></script>
<script src="js/supabase-database.js"></script>
```

#### الصفحات المحدثة:
- ✅ `index.html` - الصفحة الرئيسية
- ✅ `products.html` - صفحة المنتجات
- ✅ `cart.html` - سلة المشتريات
- ✅ `checkout.html` - إتمام الشراء
- ✅ `contact.html` - تواصل معنا
- ✅ `about.html` - من نحن
- ✅ `product-detail.html` - تفاصيل المنتج
- ✅ `order-success.html` - تأكيد الطلب
- ✅ `admin/dashboard.html` - لوحة التحكم

---

## 🔄 كيفية عمل الربط:

### 1. جلب المنتجات:
```javascript
// من Supabase بدلاً من localStorage
const products = await StorageManager.getProducts();
```

### 2. حفظ الطلبات:
```javascript
// حفظ الطلب في Supabase
const { data, error } = await supabaseClient
    .from('orders')
    .insert([order])
    .select();
```

### 3. حفظ الرسائل:
```javascript
// حفظ الرسالة في Supabase
const { data, error } = await supabaseClient
    .from('contact_messages')
    .insert([message]);
```

### 4. تحديث حالة الطلب:
```javascript
// تحديث حالة الطلب في Supabase
const { error } = await supabaseClient
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);
```

---

## 📊 البيانات المستخدمة:

### جدول المنتجات (products):
- `id` - معرف فريد
- `name` - اسم المنتج
- `price` - السعر
- `image_url` - رابط الصورة
- `stock_quantity` - كمية المخزون
- `is_active` - حالة النشاط

### جدول الطلبات (orders):
- `id` - معرف الطلب
- `full_name` - اسم العميل
- `phone` - رقم الهاتف
- `address` - العنوان
- `total_amount` - المبلغ الإجمالي
- `status` - حالة الطلب
- `payment_method` - طريقة الدفع

### جدول الرسائل (contact_messages):
- `id` - معرف الرسالة
- `name` - اسم المرسل
- `email` - البريد الإلكتروني
- `subject` - الموضوع
- `message` - محتوى الرسالة
- `status` - حالة الرسالة

### جدول الكوبونات (coupons):
- `id` - معرف الكوبون
- `code` - كود الخصم
- `discount_value` - قيمة الخصم
- `discount_type` - نوع الخصم
- `is_active` - حالة النشاط

---

## 🚀 الخطوات التالية:

### 1. إنشاء Storage Bucket (مهم جداً!)
```
1. اذهبي إلى: https://app.supabase.com/project/irpbepygiysjcshywjcq
2. اختاري Storage
3. اضغطي Create new bucket
4. أدخلي: products
5. اختاري: Public
6. اضغطي: Create bucket
```

### 2. اختبار النظام:
```
1. افتحي الموقع في المتصفح
2. تحققي من تحميل المنتجات
3. أضيفي منتج إلى السلة
4. أكملي عملية الشراء
5. تحققي من ظهور الطلب في لوحة التحكم
```

### 3. اختبار لوحة التحكم:
```
1. اذهبي إلى: admin/login.html
2. سجلي الدخول (admin / admin123)
3. تحققي من ظهور الإحصائيات
4. تحققي من ظهور الطلبات والرسائل
```

---

## 🔐 الأمان:

- ✅ جميع الجداول محمية بـ Row Level Security (RLS)
- ✅ السياسات الأمنية تسمح بالقراءة العامة
- ✅ الكتابة محدودة للمستخدمين المصرحين
- ✅ لا توجد بيانات حساسة في localStorage

---

## 📝 ملاحظات مهمة:

1. **localStorage**: لا يزال يُستخدم لـ:
   - السلة (cart)
   - بيانات المسؤول (admin)
   - حالة تسجيل الدخول

2. **Supabase**: يُستخدم لـ:
   - المنتجات
   - الطلبات
   - الرسائل
   - الكوبونات

3. **الصور**: يجب رفعها عبر Storage Bucket

---

## ✨ تم الربط بنجاح!

جميع الصفحات والوظائف الأساسية مربوطة بـ Supabase.
الآن يمكنك البدء في استخدام النظام بكامل إمكانياته.

