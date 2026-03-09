document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.experience-card');
    const statCards = document.querySelectorAll('.stat-card');
    
    cards.forEach(card => {
        card.style.opacity = '1';
    });
    
    statCards.forEach(card => {
        card.style.opacity = '1';
    });
    
    const statNumbers = document.querySelectorAll('.stat-details h3');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const value = parseInt(text.replace(/[^0-9]/g, ''));
        const hasPlus = text.includes('+');
        if (!isNaN(value)) {
            stat.textContent = value + (hasPlus ? '+' : '');
        }
    });
});