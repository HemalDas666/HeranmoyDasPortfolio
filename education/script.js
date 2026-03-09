document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.education-card');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
    
    const stats = document.querySelectorAll('.stat-row');
    stats.forEach(stat => {
        stat.style.opacity = '1';
    });
});