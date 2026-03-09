document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.skill-category');
    categories.forEach(category => {
        category.style.opacity = '1';
    });
    
    const strengths = document.querySelectorAll('.strength-item');
    strengths.forEach(strength => {
        strength.style.opacity = '1';
    });
    
    const certs = document.querySelectorAll('.cert-item');
    certs.forEach(cert => {
        cert.style.opacity = '1';
    });
});