// ===== Cache Buster System =====
// This system ensures users always get the latest version of CSS and JS files

const CacheBuster = {
    // Version number - increment this when you want to force cache refresh
    VERSION: '1.0.1',
    
    // Get cache buster query string
    getQueryString: () => `?v=${CacheBuster.VERSION}&t=${Date.now()}`,
    
    // Update all CSS and JS links with cache buster
    init: () => {
        // Update CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Only add cache buster to local files, not CDN
            if (href && !href.includes('cdn') && !href.includes('http')) {
                if (!href.includes('?')) {
                    link.setAttribute('href', href + CacheBuster.getQueryString());
                }
            }
        });
        
        // Update script src
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            // Only add cache buster to local files, not CDN
            if (src && !src.includes('cdn') && !src.includes('http')) {
                if (!src.includes('?')) {
                    script.setAttribute('src', src + CacheBuster.getQueryString());
                }
            }
        });
    },
    
    // Force refresh by clearing localStorage cache
    clearCache: () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            console.log('✅ تم مسح الـ cache بنجاح');
        } catch (error) {
            console.error('خطأ في مسح الـ cache:', error);
        }
    },
    
    // Check for updates from server
    checkForUpdates: async () => {
        try {
            const response = await fetch('js/cache-buster.js?t=' + Date.now());
            if (response.ok) {
                console.log('✅ تم التحقق من التحديثات');
            }
        } catch (error) {
            console.error('خطأ في التحقق من التحديثات:', error);
        }
    }
};

// Initialize cache buster when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CacheBuster.init();
    });
} else {
    CacheBuster.init();
}

// Check for updates periodically (every 5 minutes)
setInterval(() => {
    CacheBuster.checkForUpdates();
}, 5 * 60 * 1000);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheBuster;
}

