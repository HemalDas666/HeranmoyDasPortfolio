document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.info-item, .stat-item');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
    
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
    });
});
