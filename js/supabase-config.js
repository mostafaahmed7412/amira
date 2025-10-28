// ===== Supabase Configuration =====
// Project: amira
// Region: ap-northeast-1

const SUPABASE_URL = 'https://irpbepygiysjcshywjcq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycGJlcHlnaXlzamNzaHl3amNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTg2ODYsImV4cCI6MjA3NzA3NDY4Nn0.-XTgjhhNkM03ZIl8u3pHGVWOfcWePDmiWBHYVOGfdJA';

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Supabase Image Upload System =====
const SupabaseImageUpload = {
    BUCKET_NAME: 'products',
    
    // Upload image to Supabase Storage
    uploadImage: async (file) => {
        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;
            
            // Upload file
            const { data, error } = await supabaseClient.storage
                .from(SupabaseImageUpload.BUCKET_NAME)
                .upload(filePath, file);
            
            if (error) {
                throw error;
            }
            
            // Get public URL
            const { data: publicData } = supabaseClient.storage
                .from(SupabaseImageUpload.BUCKET_NAME)
                .getPublicUrl(filePath);
            
            return {
                success: true,
                url: publicData.publicUrl,
                path: filePath
            };
        } catch (error) {
            console.error('خطأ في رفع الصورة:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Delete image from Supabase
    deleteImage: async (filePath) => {
        try {
            const { error } = await supabaseClient.storage
                .from(SupabaseImageUpload.BUCKET_NAME)
                .remove([filePath]);
            
            if (error) {
                throw error;
            }
            
            return { success: true };
        } catch (error) {
            console.error('خطأ في حذف الصورة:', error);
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
    
    // Handle file upload with validation
    handleFileUpload: async (file, callback) => {
        // Validate
        const validation = SupabaseImageUpload.validateImage(file);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        // Show loading
        showNotification('جاري رفع الصورة...', 'info');
        
        // Upload
        const result = await SupabaseImageUpload.uploadImage(file);
        
        if (result.success) {
            showNotification('تم رفع الصورة بنجاح!', 'success');
            if (callback) callback(result);
        } else {
            showNotification(result.error || 'فشل رفع الصورة', 'error');
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseImageUpload;
}

