document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.certificate-card');
    cards.forEach(card => {
        card.style.opacity = '1';
    });
    
    const references = document.querySelectorAll('.reference-card');
    references.forEach(ref => {
        ref.style.opacity = '1';
    });
    
    const achievements = document.querySelectorAll('.achievement-item');
    achievements.forEach(achievement => {
        achievement.style.opacity = '1';
    });
});