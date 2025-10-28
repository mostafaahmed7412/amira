# 🧪 اختبار قاعدة البيانات

## ✅ الاختبارات المتاحة:

### 1. اختبار الاتصال

افتحي console (F12) وأدخلي:

```javascript
// اختبار الاتصال بـ Supabase
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('Client:', supabaseClient);
```

---

### 2. اختبار جلب المنتجات

```javascript
// جلب جميع المنتجات
const result = await SupabaseDB.getProducts();
console.log('المنتجات:', result);
```

---

### 3. اختبار جلب الفئات

```javascript
// جلب جميع الفئات
const { data, error } = await supabaseClient
    .from('categories')
    .select('*');
console.log('الفئات:', data);
```

---

### 4. اختبار إضافة منتج

```javascript
// إضافة منتج تجريبي
const newProduct = {
    name: 'منتج تجريبي',
    name_ar: 'منتج تجريبي',
    description: 'هذا منتج تجريبي',
    price: 100.00,
    category_id: 'YOUR_CATEGORY_ID', // استبدلي بـ ID فعلي
    image_url: 'https://via.placeholder.com/300',
    stock_quantity: 10,
    is_active: true
};

const result = await SupabaseDB.addProduct(newProduct);
console.log('النتيجة:', result);
```

---

### 5. اختبار البحث

```javascript
// البحث عن منتجات
const result = await SupabaseDB.searchProducts('منتج');
console.log('نتائج البحث:', result);
```

---

### 6. اختبار الكوبونات

```javascript
// جلب الكوبونات النشطة
const { data, error } = await supabaseClient
    .from('coupons')
    .select('*')
    .eq('is_active', true);
console.log('الكوبونات:', data);
```

---

### 7. اختبار الطلبات

```javascript
// إضافة طلب تجريبي
const newOrder = {
    full_name: 'اسم العميل',
    phone: '0123456789',
    address: 'العنوان',
    total_amount: 500.00,
    status: 'pending',
    payment_method: 'cash',
    payment_status: 'pending'
};

const { data, error } = await supabaseClient
    .from('orders')
    .insert([newOrder]);
console.log('الطلب:', data);
```

---

### 8. اختبار الرسائل

```javascript
// إضافة رسالة تجريبية
const newMessage = {
    name: 'اسم المرسل',
    email: 'email@example.com',
    phone: '0123456789',
    subject: 'الموضوع',
    message: 'محتوى الرسالة',
    status: 'new'
};

const { data, error } = await supabaseClient
    .from('contact_messages')
    .insert([newMessage]);
console.log('الرسالة:', data);
```

---

## 🔍 عرض البيانات من لوحة التحكم:

1. اذهبي إلى: https://app.supabase.com/project/irpbepygiysjcshywjcq
2. اختاري **Table Editor**
3. اختاري الجدول الذي تريدين عرضه
4. ستظهر جميع البيانات

---

## 📊 الاستعلامات المتقدمة:

### جلب منتجات بفئة معينة:

```javascript
const result = await SupabaseDB.getProductsByCategory('accessories');
console.log('المنتجات:', result);
```

### جلب عدد المنتجات:

```javascript
const result = await SupabaseDB.getProductsCount();
console.log('عدد المنتجات:', result.count);
```

### تحديث منتج:

```javascript
const result = await SupabaseDB.updateProduct('PRODUCT_ID', {
    name: 'اسم جديد',
    price: 150.00
});
console.log('النتيجة:', result);
```

### حذف منتج:

```javascript
const result = await SupabaseDB.deleteProduct('PRODUCT_ID');
console.log('النتيجة:', result);
```

---

## ✅ قائمة التحقق:

- [ ] الاتصال بـ Supabase يعمل
- [ ] جلب المنتجات يعمل
- [ ] جلب الفئات يعمل
- [ ] إضافة منتج يعمل
- [ ] البحث يعمل
- [ ] الكوبونات تظهر
- [ ] الطلبات تُحفظ
- [ ] الرسائل تُحفظ

---

## 🆘 حل المشاكل:

### المشكلة: "supabaseClient is not defined"
**الحل**: تأكدي من تحميل `js/supabase-config.js` قبل الاختبار

### المشكلة: "SupabaseDB is not defined"
**الحل**: تأكدي من تحميل `js/supabase-database.js`

### المشكلة: "CORS error"
**الحل**: تأكدي من أن الـ API keys صحيحة

### المشكلة: "No rows returned"
**الحل**: تأكدي من وجود بيانات في الجدول

---

## 📝 ملاحظات:

- استخدمي console (F12) لتشغيل الاختبارات
- تأكدي من تحميل جميع الملفات المطلوبة
- احفظي معرفات المنتجات والفئات للاختبارات اللاحقة

