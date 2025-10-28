// ===== Local Image Storage System =====
// تخزين الصور محلياً في المتصفح بدون الحاجة لخادم

const LocalImageStorage = {
    DB_NAME: 'AmirahStore',
    STORE_NAME: 'images',
    
    // Initialize IndexedDB
    initDB: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(LocalImageStorage.DB_NAME, 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(LocalImageStorage.STORE_NAME)) {
                    db.createObjectStore(LocalImageStorage.STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    },
    
    // Save image to IndexedDB
    saveImage: async (file) => {
        try {
            const db = await LocalImageStorage.initDB();
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    const imageData = {
                        id: Date.now().toString(),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: reader.result,
                        createdAt: new Date().toISOString()
                    };
                    
                    const transaction = db.transaction([LocalImageStorage.STORE_NAME], 'readwrite');
                    const store = transaction.objectStore(LocalImageStorage.STORE_NAME);
                    const request = store.add(imageData);
                    
                    request.onsuccess = () => {
                        resolve({
                            success: true,
                            id: imageData.id,
                            url: reader.result
                        });
                    };
                    
                    request.onerror = () => {
                        reject(request.error);
                    };
                };
                
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('خطأ في حفظ الصورة:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get image by ID
    getImage: async (imageId) => {
        try {
            const db = await LocalImageStorage.initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([LocalImageStorage.STORE_NAME], 'readonly');
                const store = transaction.objectStore(LocalImageStorage.STORE_NAME);
                const request = store.get(imageId);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('خطأ في استرجاع الصورة:', error);
            return null;
        }
    },
    
    // Get all images
    getAllImages: async () => {
        try {
            const db = await LocalImageStorage.initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([LocalImageStorage.STORE_NAME], 'readonly');
                const store = transaction.objectStore(LocalImageStorage.STORE_NAME);
                const request = store.getAll();
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('خطأ في استرجاع الصور:', error);
            return [];
        }
    },
    
    // Delete image
    deleteImage: async (imageId) => {
        try {
            const db = await LocalImageStorage.initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([LocalImageStorage.STORE_NAME], 'readwrite');
                const store = transaction.objectStore(LocalImageStorage.STORE_NAME);
                const request = store.delete(imageId);
                
                request.onsuccess = () => {
                    resolve(true);
                };
                
                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('خطأ في حذف الصورة:', error);
            return false;
        }
    },
    
    // Get storage info
    getStorageInfo: async () => {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                return {
                    usage: estimate.usage,
                    quota: estimate.quota,
                    percentage: (estimate.usage / estimate.quota) * 100
                };
            }
        } catch (error) {
            console.error('خطأ في الحصول على معلومات التخزين:', error);
        }
        return null;
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
    
    // Handle file upload
    handleFileUpload: async (file, callback) => {
        // Validate
        const validation = LocalImageStorage.validateImage(file);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        // Show loading
        showNotification('جاري حفظ الصورة...', 'info');
        
        // Save
        const result = await LocalImageStorage.saveImage(file);
        
        if (result.success) {
            showNotification('تم حفظ الصورة بنجاح!', 'success');
            if (callback) callback(result);
        } else {
            showNotification(result.error || 'فشل حفظ الصورة', 'error');
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalImageStorage;
}

