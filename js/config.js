// ===== Configuration Manager =====
// This file loads configuration from environment variables

const Config = {
    // Supabase Configuration
    supabase: {
        url: 'https://irpbepygiysjcshywjcq.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycGJlcHlnaXlzamNzaHl3amNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTg2ODYsImV4cCI6MjA3NzA3NDY4Nn0.-XTgjhhNkM03ZIl8u3pHGVWOfcWePDmiWBHYVOGfdJA'
    },

    // Admin Credentials
    admin: {
        username: 'admin',
        password: 'admin123'
    },

    // API Configuration
    api: {
        baseUrl: 'https://irpbepygiysjcshywjcq.supabase.co'
    },

    // Environment
    env: 'development',

    // Get configuration value
    get: (key, defaultValue = null) => {
        const keys = key.split('.');
        let value = Config;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    },

    // Set configuration value
    set: (key, value) => {
        const keys = key.split('.');
        let obj = Config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in obj)) {
                obj[k] = {};
            }
            obj = obj[k];
        }
        
        obj[keys[keys.length - 1]] = value;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}

