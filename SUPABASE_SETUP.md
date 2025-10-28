# 🚀 دليل إعداد Supabase

## الخطوة 1: إنشاء حساب Supabase

1. اذهبي إلى: **https://supabase.com**
2. اضغطي على **"Sign Up"**
3. سجلي باستخدام:
   - GitHub (الأسهل)
   - Google
   - أو بريد إلكتروني

---

## الخطوة 2: إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغطي **"New Project"**
2. أدخلي البيانات:
   - **Project Name**: `amira-store` (أو أي اسم تفضلينه)
   - **Database Password**: كلمة مرور قوية (احفظيها!)
   - **Region**: اختاري `eu-north-1` (الأقرب لأوروبا)
3. اضغطي **"Create new project"**
4. انتظري 2-3 دقائق حتى ينتهي الإعداد

---

## الخطوة 3: إعداد Storage (لرفع الصور)

1. من القائمة الجانبية، اضغطي **"Storage"**
2. اضغطي **"Create new bucket"**
3. أدخلي البيانات:
   - **Bucket name**: `products`
   - **Public bucket**: ✅ اختاري "Public"
4. اضغطي **"Create bucket"**

---

## الخطوة 4: الحصول على مفاتيح الاتصال

1. من القائمة الجانبية، اضغطي **"Settings"**
2. اختاري **"API"**
3. ستجدين:
   - **Project URL** (مثال: `https://xxxxx.supabase.co`)
   - **anon public** (مثال: `eyJhbGc...`)

---

## الخطوة 5: إضافة المفاتيح في الكود

افتحي ملف `js/supabase-config.js` وأضيفي المفاتيح:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // ضعي Project URL هنا
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // ضعي anon public key هنا
```

---

## الخطوة 6: اختبار النظام

1. افتحي صفحة `admin/add-product.html`
2. جربي رفع صورة
3. يجب أن تظهر رسالة نجاح

---

## 📋 ملخص البيانات المهمة

احفظي هذه البيانات في مكان آمن:

```
Project Name: amira-store
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGc...
Database Password: ****
```

---

## ⚠️ نصائح أمان مهمة

1. **لا تشاركي المفاتيح** مع أحد
2. **لا تضعي المفاتيح** في ملفات عامة
3. **استخدمي متغيرات البيئة** في المشاريع الكبيرة
4. **فعّلي Row Level Security** لحماية البيانات

---

## 🆘 حل المشاكل الشائعة

### المشكلة: "CORS error"
**الحل**: تأكدي من أن Bucket مضبوط على "Public"

### المشكلة: "Invalid API key"
**الحل**: تأكدي من نسخ المفتاح بشكل صحيح بدون مسافات

### المشكلة: الصور لا تظهر
**الحل**: تأكدي من أن الصورة موجودة في Storage من لوحة التحكم

---

## 📚 روابط مفيدة

- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- JavaScript Client: https://supabase.com/docs/reference/javascript

---

## ✅ تم الإعداد بنجاح!

الآن يمكنك:
- ✅ رفع الصور مباشرة
- ✅ حفظ بيانات المنتجات
- ✅ إدارة الصور من لوحة التحكم

