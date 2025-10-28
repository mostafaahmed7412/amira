// ===== Contact Page Script =====

// Handle Contact Form Submission
async function handleContactForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    try {
        // Save message to Supabase
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert([{
                name,
                email,
                phone,
                subject,
                message,
                status: 'new'
            }]);

        if (error) {
            throw error;
        }

        // Show success message
        showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا', 'success');

        // Reset form
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('خطأ في إرسال الرسالة:', error);
        showNotification('حدث خطأ في إرسال الرسالة. حاولي لاحقاً', 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

