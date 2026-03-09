const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

const currentPath = window.location.pathname;
document.querySelectorAll('.nav-menu a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath.includes('/contact/') && linkPath.includes('/contact/'))) {
        link.classList.add('active');
    }
});

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    nav.style.background = window.scrollY > 50 ? 'rgba(42, 27, 61, 0.98)' : 'rgba(42, 27, 61, 0.95)';
});

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner"></i>';
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                contactForm.reset();
                
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send. Please email me directly at heranmoydas2003@gmail.com';
            
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        }
    });
}

function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
        timeElement.textContent = now.toLocaleTimeString('en-US', options);
    }
}

updateTime();
setInterval(updateTime, 60000);

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        item.classList.toggle('active');
    });
});

const fileInput = document.getElementById('attachment');
const fileLabel = document.querySelector('.file-label');

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name;
        fileLabel.textContent = fileName ? `📎 ${fileName}` : 'Choose file or drag here';
        fileLabel.style.color = fileName ? '#e67ed4' : 'rgba(255, 255, 255, 0.5)';
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        const timestamp = new Date().toISOString();
        const timeInput = document.createElement('input');
        timeInput.type = 'hidden';
        timeInput.name = '_timestamp';
        timeInput.value = timestamp;
        form.appendChild(timeInput);
    }
    
    const cards = document.querySelectorAll('.method-card, .social-card, .faq-item');
    cards.forEach(card => {
        card.style.opacity = '1';
    });
});