# 📸 إعداد Supabase Storage لرفع الصور

## معلومات مشروعك:

```
Project Name: amira
Project ID: irpbepygiysjcshywjcq
Region: ap-northeast-1
Project URL: https://irpbepygiysjcshywjcq.supabase.co
```

---

## الخطوة 1: الدخول إلى لوحة التحكم

1. اذهبي إلى: **https://app.supabase.com**
2. اختاري مشروع **amira**

---

## الخطوة 2: إنشاء Storage Bucket

1. من القائمة الجانبية، اضغطي **"Storage"**
2. اضغطي **"Create new bucket"**
3. أدخلي البيانات:
   - **Bucket name**: `products`
   - **Public bucket**: ✅ اختاري "Public"
4. اضغطي **"Create bucket"**

---

## الخطوة 3: تعيين صلاحيات الوصول (RLS Policies)

بعد إنشاء الـ bucket، اضغطي عليه واختاري **"Policies"**

### السياسة 1: السماح بالقراءة العامة

```sql
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'products');
```

### السياسة 2: السماح برفع الملفات

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'products');
```

---

## الخطوة 4: اختبار الاتصال

افتحي صفحة `admin/add-product.html` وجربي:

1. اضغطي على منطقة رفع الصور
2. اختاري صورة من جهازك
3. يجب أن تظهر رسالة نجاح

---

## 📋 معلومات الاتصال المستخدمة

```javascript
// في js/supabase-config.js
const SUPABASE_URL = 'https://irpbepygiysjcshywjcq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🔗 روابط مفيدة

- لوحة التحكم: https://app.supabase.com/project/irpbepygiysjcshywjcq
- Storage Docs: https://supabase.com/docs/guides/storage
- API Reference: https://supabase.com/docs/reference/javascript/storage-createbucket

---

## ⚠️ ملاحظات أمان

1. **المفتاح المستخدم (anon key)** آمن للاستخدام في الواجهة الأمامية
2. **لا تستخدمي service key** في الكود الأمامي
3. **فعّلي RLS policies** لحماية البيانات

---

## ✅ الخطوات التالية

بعد إعداد Storage:

1. ✅ رفع الصور مباشرة من الموقع
2. ✅ حفظ روابط الصور في قاعدة البيانات
3. ✅ عرض الصور في المتجر
4. ✅ حذف الصور القديمة

---

## 🆘 حل المشاكل

### المشكلة: "Bucket not found"
**الحل**: تأكدي من إنشاء bucket باسم `products`

### المشكلة: "Access denied"
**الحل**: تأكدي من تفعيل "Public bucket"

### المشكلة: الصور لا تظهر
**الحل**: تأكدي من أن الصورة موجودة في Storage من لوحة التحكم

