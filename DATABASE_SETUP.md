# 🗄️ إعداد قاعدة البيانات - Supabase

## الخطوة 1: إنشاء جدول المنتجات

1. اذهبي إلى: https://app.supabase.com/project/irpbepygiysjcshywjcq
2. اختاري **SQL Editor** من القائمة الجانبية
3. اضغطي **New Query**
4. انسخي والصقي هذا الكود:

```sql
-- Create products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  image_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
ON products
FOR SELECT
USING (true);

-- Create policy for authenticated insert
CREATE POLICY "Allow authenticated insert"
ON products
FOR INSERT
WITH CHECK (true);

-- Create policy for authenticated update
CREATE POLICY "Allow authenticated update"
ON products
FOR UPDATE
USING (true);

-- Create policy for authenticated delete
CREATE POLICY "Allow authenticated delete"
ON products
FOR DELETE
USING (true);
```

5. اضغطي **Run** (أو Ctrl+Enter)

---

## الخطوة 2: التحقق من الجدول

1. اذهبي إلى **Table Editor**
2. يجب أن تظهر جدول جديد باسم `products`
3. تحققي من الأعمدة:
   - `id` - معرف فريد
   - `name` - اسم المنتج
   - `description` - الوصف
   - `price` - السعر
   - `category` - الفئة
   - `image_url` - رابط الصورة
   - `image_path` - مسار الصورة في Storage
   - `created_at` - تاريخ الإنشاء
   - `updated_at` - تاريخ التحديث

---

## الخطوة 3: إضافة منتج تجريبي

```sql
INSERT INTO products (name, description, price, category, image_url)
VALUES (
  'منتج تجريبي',
  'هذا منتج تجريبي للاختبار',
  100.00,
  'accessories',
  'https://via.placeholder.com/300'
);
```

---

## الخطوة 4: استخدام قاعدة البيانات في الكود

### إضافة منتج جديد:

```javascript
async function addProduct(productData) {
    const { data, error } = await supabaseClient
        .from('products')
        .insert([productData]);
    
    if (error) {
        console.error('خطأ:', error);
        return false;
    }
    
    console.log('تم إضافة المنتج:', data);
    return true;
}

// الاستخدام:
await addProduct({
    name: 'منتج جديد',
    description: 'وصف المنتج',
    price: 150.00,
    category: 'gifts',
    image_url: 'https://...',
    image_path: 'products/...'
});
```

### الحصول على جميع المنتجات:

```javascript
async function getProducts() {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('خطأ:', error);
        return [];
    }
    
    return data;
}
```

### البحث عن منتجات بفئة معينة:

```javascript
async function getProductsByCategory(category) {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('خطأ:', error);
        return [];
    }
    
    return data;
}
```

### تحديث منتج:

```javascript
async function updateProduct(id, updates) {
    const { data, error } = await supabaseClient
        .from('products')
        .update(updates)
        .eq('id', id);
    
    if (error) {
        console.error('خطأ:', error);
        return false;
    }
    
    return true;
}
```

### حذف منتج:

```javascript
async function deleteProduct(id) {
    const { data, error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('خطأ:', error);
        return false;
    }
    
    return true;
}
```

---

## 📋 مثال عملي كامل:

```javascript
// حفظ منتج جديد مع صورة
async function saveProductWithImage(productForm, imageUrl, imagePath) {
    const product = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        image_url: imageUrl,
        image_path: imagePath
    };
    
    const { data, error } = await supabaseClient
        .from('products')
        .insert([product]);
    
    if (error) {
        showNotification('فشل حفظ المنتج', 'error');
        return false;
    }
    
    showNotification('تم حفظ المنتج بنجاح!', 'success');
    return true;
}
```

---

## 🔐 الأمان:

- ✅ RLS مفعّل لحماية البيانات
- ✅ السياسات تسمح بالقراءة العامة
- ✅ الكتابة محدودة للمستخدمين المصرح لهم

---

## 📚 روابط مفيدة:

- SQL Editor: https://app.supabase.com/project/irpbepygiysjcshywjcq/sql
- Table Editor: https://app.supabase.com/project/irpbepygiysjcshywjcq/editor
- Database Docs: https://supabase.com/docs/guides/database

