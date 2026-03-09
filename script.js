// ===== NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (!navMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

const currentPath = window.location.pathname;

function updateActiveLink(path) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === path || 
            (path === '/' && href === '/') ||
            (path.includes(href) && href !== '/')) {
            link.classList.add('active');
        }
    });
}

updateActiveLink(currentPath);

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(42, 27, 61, 0.98)';
    } else {
        nav.style.background = 'rgba(42, 27, 61, 0.95)';
    }
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 200);
});

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVh();
window.addEventListener('resize', setVh);

// ===== VISITOR COUNTER =====
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    let visitorCount = localStorage.getItem('visitorCount');
    
    if (visitorCount === null) {
        visitorCount = 1;
    } else {
        visitorCount = parseInt(visitorCount) + 1;
    }
    
    localStorage.setItem('visitorCount', visitorCount);
    
    const countElement = document.getElementById('visitorCount');
    if (countElement) {
        countElement.textContent = visitorCount;
    }
}

// ===== FIREBASE AUTHENTICATION =====
let currentUser = null;
let firebaseReady = false;

// Check if Firebase is ready
if (window.firebaseAuth) {
    firebaseReady = true;
    console.log('Firebase already available');
}

// Listen for Firebase ready event
window.addEventListener('firebase-ready', () => {
    firebaseReady = true;
    console.log('Firebase is now ready');
    
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoginStatus();
    }
});

const savedUser = sessionStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
}

function updateUIForLoginStatus() {
    const loginTrigger = document.getElementById('openPopupBtn');
    if (!loginTrigger) return;
    
    if (currentUser) {
        const firstName = currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'User';
        loginTrigger.innerHTML = `<i class="fas fa-user-circle"></i><span>${firstName}</span>`;
        
        if (!document.querySelector('.logout-trigger')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-trigger';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.title = 'Logout';
            logoutBtn.addEventListener('click', logout);
            loginTrigger.parentNode.insertBefore(logoutBtn, loginTrigger.nextSibling);
        }
    } else {
        loginTrigger.innerHTML = `<i class="fas fa-user-circle"></i><span>Login</span>`;
        
        const logoutBtn = document.querySelector('.logout-trigger');
        if (logoutBtn) {
            logoutBtn.remove();
        }
    }
}

async function logout() {
    try {
        if (firebaseReady && window.signOut) {
            await window.signOut(window.firebaseAuth);
        }
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        updateUIForLoginStatus();
        showNotification('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    }
}

function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== POPUP ELEMENTS =====
const openPopupBtn = document.getElementById('openPopupBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (openPopupBtn) {
    openPopupBtn.addEventListener('click', () => {
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closePopup) {
    closePopup.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (loginTab && signupTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

// ===== FIREBASE SIGNUP =====
const signupFormElement = document.getElementById('signupFormElement');
if (signupFormElement) {
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = signupFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        
        const name = signupFormElement.querySelector('input[placeholder="Full Name"]').value;
        const email = signupFormElement.querySelector('input[placeholder="Email Address"]').value;
        const password = signupFormElement.querySelector('input[placeholder="Password"]').value;
        const confirmPassword = signupFormElement.querySelectorAll('input[placeholder="Password"]')[1].value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        if (!firebaseReady || !window.createUserWithEmailAndPassword) {
            showNotification('Firebase not ready. Please refresh.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            console.log('Attempting to create user:', email);
            
            const userCredential = await window.createUserWithEmailAndPassword(
                window.firebaseAuth, 
                email, 
                password
            );
            
            const user = userCredential.user;
            console.log('User created:', user.uid);
            
            await window.setDoc(window.doc(window.firebaseDb, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                uid: user.uid
            });
            
            console.log('User data saved to Firestore');
            
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: name
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Account created successfully!', 'success');
            
            setTimeout(() => {
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
                updateUIForLoginStatus();
            }, 1500);
            
            signupFormElement.reset();
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already in use';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check connection';
                    break;
                default:
                    errorMessage = error.message || 'Signup failed';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== FIREBASE LOGIN =====
const loginFormElement = document.getElementById('loginFormElement');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = loginFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        const email = loginFormElement.querySelector('input[type="email"]').value;
        const password = loginFormElement.querySelector('input[type="password"]').value;
        
        if (!firebaseReady || !window.signInWithEmailAndPassword) {
            showNotification('Firebase not ready. Please refresh.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            console.log('Attempting to login:', email);
            
            const userCredential = await window.signInWithEmailAndPassword(
                window.firebaseAuth, 
                email, 
                password
            );
            
            const user = userCredential.user;
            console.log('User logged in:', user.uid);
            
            let userName = email.split('@')[0];
            try {
                const userDoc = await window.getDoc(window.doc(window.firebaseDb, 'users', user.uid));
                if (userDoc.exists()) {
                    userName = userDoc.data().name || userName;
                }
            } catch (e) {
                console.warn('Could not fetch user data:', e);
            }
            
            try {
                await window.updateDoc(window.doc(window.firebaseDb, 'users', user.uid), {
                    lastLogin: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Could not update last login:', e);
            }
            
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: userName
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
                updateUIForLoginStatus();
            }, 1500);
            
            loginFormElement.reset();
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed';
            
            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Try again later';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check connection';
                    break;
                default:
                    errorMessage = error.message || 'Login failed';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Password reset - Feature coming soon', 'error');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking Firebase status...');
    updateUIForLoginStatus();
    
    const style = document.createElement('style');
    style.textContent = `
        .logout-trigger {
            position: fixed;
            bottom: 20px;
            right: 100px;
            background: rgba(230, 126, 212, 0.15);
            border: 1px solid rgba(230, 126, 212, 0.3);
            border-radius: 50px;
            padding: 0.6rem 1rem;
            color: #fff;
            cursor: pointer;
            z-index: 998;
            backdrop-filter: blur(5px);
            transition: background 0.2s;
        }
        
        .logout-trigger i {
            color: #e67ed4;
            font-size: 1.1rem;
        }
        
        .logout-trigger:hover {
            background: rgba(230, 126, 212, 0.3);
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(42, 27, 61, 0.95);
            border-left: 4px solid #e67ed4;
            border-radius: 8px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #fff;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left-color: #00ff00;
        }
        
        .notification.success i {
            color: #00ff00;
        }
        
        .notification.error {
            border-left-color: #ff4444;
        }
        
        .notification.error i {
            color: #ff4444;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
            .logout-trigger {
                bottom: 15px;
                right: 85px;
                padding: 0.5rem 0.8rem;
            }
            
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                padding: 0.8rem 1rem;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
});