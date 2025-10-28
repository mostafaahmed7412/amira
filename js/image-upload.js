// ===== Image Upload System =====
// This system uses ImgBB (free, no registration needed)
// Alternative: Supabase for more features

const ImageUpload = {
    // ImgBB API (Free, no registration needed)
    IMGBB_API_KEY: 'YOUR_IMGBB_API_KEY', // Get free key from https://imgbb.com/api
    
    // Upload image to ImgBB
    uploadToImgBB: async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', ImageUpload.IMGBB_API_KEY);
            
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('فشل رفع الصورة');
            }
            
            const data = await response.json();
            return {
                success: true,
                url: data.data.url,
                deleteUrl: data.data.delete_url
            };
        } catch (error) {
            console.error('خطأ في رفع الصورة:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Upload image to Supabase (Alternative - requires setup)
    uploadToSupabase: async (file, bucket = 'products') => {
        try {
            // This requires Supabase setup
            // See setup instructions below
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(
                `${SUPABASE_URL}/storage/v1/object/${bucket}/${Date.now()}_${file.name}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'x-upsert': 'true'
                    },
                    body: file
                }
            );
            
            if (!response.ok) {
                throw new Error('فشل رفع الصورة');
            }
            
            return {
                success: true,
                url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${Date.now()}_${file.name}`
            };
        } catch (error) {
            console.error('خطأ في رفع الصورة:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Validate image
    validateImage: (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'نوع الملف غير مدعوم. استخدمي JPG أو PNG أو WebP'
            };
        }
        
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'حجم الملف كبير جداً. الحد الأقصى 5MB'
            };
        }
        
        return { valid: true };
    },
    
    // Handle file input change
    handleFileSelect: async (event, callback) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate
        const validation = ImageUpload.validateImage(file);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        // Show loading
        showNotification('جاري رفع الصورة...', 'info');
        
        // Upload
        const result = await ImageUpload.uploadToImgBB(file);
        
        if (result.success) {
            showNotification('تم رفع الصورة بنجاح!', 'success');
            if (callback) callback(result.url);
        } else {
            showNotification(result.error || 'فشل رفع الصورة', 'error');
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageUpload;
}

