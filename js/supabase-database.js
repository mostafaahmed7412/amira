// ===== Supabase Database Operations =====
// التعامل مع قاعدة البيانات

// Helper function to transform Supabase product data to app format
function transformProduct(product) {
    return {
        id: product.id,
        name: product.name,
        name_ar: product.name_ar,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category_id, // Map category_id to category for compatibility
        category_id: product.category_id,
        image: product.image_url, // Map image_url to image for compatibility
        image_url: product.image_url,
        stock: product.stock_quantity, // Map stock_quantity to stock for compatibility
        stock_quantity: product.stock_quantity,
        featured: product.is_featured, // Map is_featured to featured for compatibility
        is_featured: product.is_featured,
        new: product.is_active, // Assume new products are active
        is_active: product.is_active,
        created_at: product.created_at,
        updated_at: product.updated_at
    };
}

const SupabaseDB = {
    TABLE_NAME: 'products',

    // Add new product
    addProduct: async (productData) => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .insert([productData])
                .select();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data[0]
            };
        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Get all products
    getProducts: async () => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform products to app format
            const transformedData = (data || []).map(transformProduct);

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('خطأ في جلب المنتجات:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    },
    
    // Get products by category
    getProductsByCategory: async (category) => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .select('*')
                .eq('category_id', category)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform products to app format
            const transformedData = (data || []).map(transformProduct);

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('خطأ في جلب المنتجات:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    },
    
    // Get product by ID
    getProduct: async (id) => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Transform product to app format
            const transformedData = transformProduct(data);

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('خطأ في جلب المنتج:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Update product
    updateProduct: async (id, updates) => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .update(updates)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            
            return {
                success: true,
                data: data[0]
            };
        } catch (error) {
            console.error('خطأ في تحديث المنتج:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Delete product
    deleteProduct: async (id) => {
        try {
            const { error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Search products
    searchProducts: async (query) => {
        try {
            const { data, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .select('*')
                .eq('is_active', true)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform products to app format
            const transformedData = (data || []).map(transformProduct);

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('خطأ في البحث:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    },
    
    // Get products count
    getProductsCount: async () => {
        try {
            const { count, error } = await supabaseClient
                .from(SupabaseDB.TABLE_NAME)
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            
            return {
                success: true,
                count: count || 0
            };
        } catch (error) {
            console.error('خطأ في عد المنتجات:', error);
            return {
                success: false,
                error: error.message,
                count: 0
            };
        }
    },
    
    // Delete image from storage when deleting product
    deleteProductWithImage: async (id, imagePath) => {
        try {
            // Delete from database
            const dbResult = await SupabaseDB.deleteProduct(id);
            if (!dbResult.success) throw new Error('فشل حذف المنتج من قاعدة البيانات');
            
            // Delete image from storage
            if (imagePath) {
                const storageResult = await SupabaseImageUpload.deleteImage(imagePath);
                if (!storageResult.success) {
                    console.warn('تحذير: فشل حذف الصورة من التخزين');
                }
            }
            
            return { success: true };
        } catch (error) {
            console.error('خطأ في حذف المنتج والصورة:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseDB;
}

