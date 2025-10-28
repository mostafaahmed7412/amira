# 🚀 دليل البدء السريع - نظام رفع الصور

## ✅ ما تم إعداده:

- ✅ مشروع Supabase جاهز: **amira**
- ✅ ملف إعدادات الاتصال: `js/supabase-config.js`
- ✅ صفحة إضافة منتج: `admin/add-product.html`
- ✅ نظام رفع الصور: `js/supabase-config.js`

---

## 🎯 الخطوات الأساسية:

### 1️⃣ إنشاء Storage Bucket

1. اذهبي إلى: https://app.supabase.com/project/irpbepygiysjcshywjcq
2. اختاري **Storage** من القائمة الجانبية
3. اضغطي **Create new bucket**
4. أدخلي:
   - **Name**: `products`
   - **Public**: ✅ اختاري Public
5. اضغطي **Create bucket**

### 2️⃣ اختبار النظام

1. افتحي: `admin/add-product.html`
2. ملئي البيانات:
   - اسم المنتج
   - الوصف
   - السعر
   - الفئة
3. اسحبي صورة أو اضغطي لاختيار صورة
4. اضغطي **حفظ المنتج**

### 3️⃣ التحقق من الصور

1. اذهبي إلى Supabase Dashboard
2. اختاري **Storage** → **products**
3. يجب أن تظهر الصور المرفوعة

---

## 📝 مثال عملي:

```html
<!-- استخدام نظام رفع الصور في أي صفحة -->

<input type="file" id="imageInput" accept="image/*">
<img id="preview" src="">

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/app.js"></script>
<script src="js/supabase-config.js"></script>

<script>
    document.getElementById('imageInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const result = await SupabaseImageUpload.uploadImage(file);
        if (result.success) {
            document.getElementById('preview').src = result.url;
            console.log('رابط الصورة:', result.url);
        }
    });
</script>
```

---

## 🔧 الملفات المهمة:

| الملف | الوصف |
|------|-------|
| `js/supabase-config.js` | إعدادات الاتصال بـ Supabase |
| `admin/add-product.html` | صفحة إضافة منتج مع رفع صورة |
| `SUPABASE_STORAGE_SETUP.md` | دليل إعداد Storage |

---

## 💡 نصائح مهمة:

1. **احفظي روابط الصور** في localStorage أو قاعدة بيانات
2. **استخدمي صور بحجم معقول** (أقل من 5MB)
3. **اختبري على متصفح مختلف** للتأكد من الاتصال

---

## 🆘 المساعدة:

- Supabase Dashboard: https://app.supabase.com
- Storage Documentation: https://supabase.com/docs/guides/storage
- JavaScript Client: https://supabase.com/docs/reference/javascript

---

## ✨ الخطوات التالية:

بعد إعداد Storage:

1. ✅ إضافة جدول `products` في قاعدة البيانات
2. ✅ ربط الصور بـ بيانات المنتجات
3. ✅ عرض الصور في المتجر
4. ✅ إضافة خاصية الحذف

---

## 📞 تواصل:

إذا واجهتِ أي مشكلة:
1. تحققي من اتصال الإنترنت
2. تأكدي من إنشاء bucket باسم `products`
3. افتحي console (F12) وتحققي من الأخطاء

