const firebaseConfig = {
    apiKey: "AIzaSyBMLnucxfbjXi0Lf0TZEjT1Nd_1aXihTv4",
    authDomain: "learningdb-2e196.firebaseapp.com",
    databaseURL: "https://learningdb-2e196-default-rtdb.firebaseio.com",
    projectId: "learningdb-2e196",
    storageBucket: "learningdb-2e196.firebasestorage.app",
    messagingSenderId: "298577512231",
    appId: "1:298577512231:web:87c2d751da7202d1f24b02"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

let currentUser = null;
let currentUsername = null;

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

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const counterRef = database.ref('visitorCounter');
    
    counterRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    }).then((result) => {
        const countElement = document.getElementById('visitorCount');
        if (countElement) {
            countElement.textContent = result.snapshot.val() || 0;
        }
    });
    
    database.ref('visitorCounter').on('value', (snapshot) => {
        const countElement = document.getElementById('visitorCount');
        if (countElement) {
            countElement.textContent = snapshot.val() || 0;
        }
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in - get username from database
        database.ref('users/' + user.uid).once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    username: userData.username,
                    createdAt: userData.createdAt,
                    lastLogin: userData.lastLogin
                };
                currentUsername = userData.username;
                updateUIForLoggedInUser();
            }
        });
    } else {
        currentUser = null;
        currentUsername = null;
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser() {
    const loginTrigger = document.getElementById('openPopupBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileCircle = document.getElementById('profileCircle');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (loginTrigger && currentUsername) {
        const firstLetter = currentUsername.charAt(0).toUpperCase();
        
        loginTrigger.innerHTML = `
            <div class="profile-circle-small">${firstLetter}</div>
        `;
        loginTrigger.classList.add('profile-trigger');
        
        if (profileCircle) profileCircle.textContent = firstLetter;
        if (profileName) profileName.textContent = currentUsername;
        if (profileEmail) profileEmail.textContent = currentUser.email;
    }
    
    document.addEventListener('click', closeDropdownOnClickOutside);
}

function updateUIForLoggedOutUser() {
    const loginTrigger = document.getElementById('openPopupBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (loginTrigger) {
        loginTrigger.innerHTML = `<i class="fas fa-user-circle"></i><span>Login</span>`;
        loginTrigger.classList.remove('profile-trigger');
    }
    
    if (profileDropdown) {
        profileDropdown.classList.remove('show');
    }
    
    document.removeEventListener('click', closeDropdownOnClickOutside);
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function closeDropdownOnClickOutside(e) {
    const dropdown = document.getElementById('profileDropdown');
    const loginTrigger = document.getElementById('openPopupBtn');
    
    if (dropdown && loginTrigger) {
        if (!dropdown.contains(e.target) && !loginTrigger.contains(e.target)) {
            dropdown.classList.remove('show');
        }
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

function checkUsernameExists(username) {
    return database.ref('usernames/' + username.toLowerCase()).once('value')
        .then((snapshot) => {
            return snapshot.exists();
        });
}

const openPopupBtn = document.getElementById('openPopupBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (openPopupBtn) {
    openPopupBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (currentUser) {
            toggleProfileDropdown();
        } else {
            popupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
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

const signupFormElement = document.getElementById('signupFormElement');
if (signupFormElement) {
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = signupFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validation
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
        
        if (username.length < 3) {
            showNotification('Username must be at least 3 characters', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            // Check if username exists
            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                showNotification('Username already taken', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Save user data to database
            const userData = {
                username: username,
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            await database.ref('users/' + user.uid).set(userData);
            await database.ref('usernames/' + username.toLowerCase()).set(user.uid);
            
            showNotification('Account created successfully!', 'success');
            
            setTimeout(() => {
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
                signupFormElement.reset();
            }, 1500);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already registered';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== LOGIN FORM =====
const loginFormElement = document.getElementById('loginFormElement');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = loginFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        try {
            // Get user ID from username
            const usernameSnapshot = await database.ref('usernames/' + username.toLowerCase()).once('value');
            const uid = usernameSnapshot.val();
            
            if (!uid) {
                showNotification('Username not found', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Get user email from database
            const userSnapshot = await database.ref('users/' + uid + '/email').once('value');
            const email = userSnapshot.val();
            
            if (!email) {
                showNotification('User data not found', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Login with email and password
            await auth.signInWithEmailAndPassword(email, password);
            
            // Update last login
            await database.ref('users/' + uid).update({
                lastLogin: new Date().toISOString()
            });
            
            showNotification('Login successful!', 'success');
            
            // Close popup
            setTimeout(() => {
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
                loginFormElement.reset();
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Invalid username or password';
            
            switch(error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid username or password';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Try again later';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== FORGOT PASSWORD =====
const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = prompt('Enter your email address:');
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    showNotification('Password reset email sent!', 'success');
                })
                .catch((error) => {
                    showNotification('Error: ' + error.message, 'error');
                });
        }
    });
}

// ===== PROFILE DROPDOWN BUTTONS =====
document.getElementById('userDetailsBtn')?.addEventListener('click', () => {
    // Hide dropdown
    document.getElementById('profileDropdown').classList.remove('show');
    
    // Show user details modal
    if (currentUser) {
        document.getElementById('detailUsername').textContent = currentUser.username || '-';
        document.getElementById('detailEmail').textContent = currentUser.email || '-';
        document.getElementById('detailJoined').textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : '-';
        document.getElementById('detailLastLogin').textContent = currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : '-';
        document.getElementById('detailUID').textContent = currentUser.uid || '-';
        
        document.getElementById('userDetailsModal').classList.add('active');
    }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    // Hide dropdown
    document.getElementById('profileDropdown').classList.remove('show');
    
    // Logout
    auth.signOut().then(() => {
        showNotification('Logged out successfully', 'success');
    }).catch((error) => {
        showNotification('Error logging out', 'error');
    });
});

// ===== CLOSE MODAL =====
document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('userDetailsModal').classList.remove('active');
});

document.getElementById('userDetailsModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('userDetailsModal')) {
        document.getElementById('userDetailsModal').classList.remove('active');
    }
});

// ===== CLOSE ON ESCAPE KEY =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close popup
        if (popupOverlay.classList.contains('active')) {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close modal
        const modal = document.getElementById('userDetailsModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
        
        // Close dropdown
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
});

// ===== ADD DYNAMIC STYLES =====
const style = document.createElement('style');
style.textContent = `
    .profile-trigger {
        padding: 0.3rem !important;
    }
    
    .profile-circle-small {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #e67ed4, #a64d79);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .login-trigger {
        transition: all 0.2s ease;
    }
    
    .login-trigger.profile-trigger {
        background: rgba(230, 126, 212, 0.3);
    }
`;
document.head.appendChild(style);

// ===== SMART AI ASSISTANT WITH FIXED API KEY FORMAT =====
class SmartAIAssistant {
    constructor() {
        // Your API key - now with correct format
        this.API_KEY = 'a701a100-ba21-474c-a76b-6ce461be6378';
        this.API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        this.MODEL = 'google/gemini-2.0-flash-exp:free'; // Free model
        
        this.initializeElements();
        this.attachEvents();
        this.loadHistory();
        this.setupFallbackResponses(); // Setup fallback responses
    }

    initializeElements() {
        this.trigger = document.getElementById('smartAiTrigger');
        this.container = document.getElementById('smartAiContainer');
        this.messages = document.getElementById('smartAiMessages');
        this.input = document.getElementById('smartAiInput');
        this.sendBtn = document.getElementById('smartAiSend');
        this.clearBtn = document.getElementById('smartAiClear');
        this.closeBtn = document.getElementById('smartAiClose');
        this.suggestions = document.querySelectorAll('.smart-ai-suggestion');
        
        if (!this.trigger || !this.container) {
            console.error('AI Assistant elements not found!');
            return;
        }
        
        console.log('✅ AI Assistant Initialized');
    }

    setupFallbackResponses() {
        // Fallback responses in case API fails
        this.fallbackResponses = {
            'heranmoy': `👤 **About Heranmoy Das:**

Heranmoy Das is a **Digital Marketing Specialist & Mentor** with NSDA Level-3 Certification.

**Expertise:**
• SEO (Search Engine Optimization)
• SEM (Search Engine Marketing)
• Lead Generation
• Performance-Based Campaign Management

**Experience:**
• Digital Marketing Specialist
• Mentor for 500+ students
• 200%+ ROAS on campaigns
• 150% organic traffic increase

**Contact:** heranmoy.das@example.com`,
            
            'skills': `💪 **Heranmoy's Key Skills:**

• Digital Marketing Strategy
• SEO & SEM
• Lead Generation
• Social Media Marketing
• Content Marketing
• Google Analytics
• Facebook/Google Ads
• Campaign Management
• Marketing Analytics
• Team Training & Mentoring`,
            
            'contact': `📬 **Contact Heranmoy Das:**

📧 Email: heranmoy.das@example.com
💼 LinkedIn: linkedin.com/in/heranmoydas
📱 GitHub: github.com/heranmoydas
🌐 Portfolio: www.heranmoy.com

Or use the contact form on this website!`,
            
            'certification': `🏆 **Heranmoy's Certifications:**

• NSDA Level-3 Certified Digital Marketing Specialist
• Google Analytics Individual Qualification
• Google Ads Certification
• Facebook Blueprint Certification
• HubSpot Content Marketing Certification
• SEMrush SEO Toolkit Certification`,
            
            'experience': `💼 **Professional Experience:**

**Digital Marketing Specialist** (Current)
• Managing SEO/SEM campaigns
• Lead generation optimization
• Performance marketing

**Digital Marketing Mentor**
• Trained 500+ students
• Workshop facilitator
• Curriculum developer

**Key Achievements:**
• 200%+ ROAS on PPC campaigns
• 150% organic traffic growth
• 50+ successful projects`,
            
            'service': `🛠️ **Services Offered:**

✓ SEO Audit & Optimization
✓ Social Media Management
✓ PPC Campaign Management
✓ Lead Generation
✓ Content Strategy
✓ Marketing Analytics
✓ Digital Marketing Consultation
✓ Team Training
✓ Website Analytics Setup
✓ Conversion Rate Optimization`,
            
            'digital marketing': `📱 **Digital Marketing Overview:**

Digital marketing promotes products/services through digital channels:

**Main Channels:**
• SEO - Organic search visibility
• SEM - Paid advertising
• Social Media - Platform marketing
• Email Marketing - Direct communication
• Content Marketing - Valuable content
• Affiliate Marketing - Partnership marketing

**Benefits:**
• Global reach
• Measurable results
• Cost-effective
• Targeted audience
• Real-time analytics`,
            
            'seo': `🔍 **SEO (Search Engine Optimization):**

SEO improves website visibility in search engines.

**Key Components:**
• Keyword Research
• On-Page Optimization
• Technical SEO
• Link Building
• Local SEO
• Mobile Optimization
• Content Quality
• User Experience

**Benefits:**
• Free organic traffic
• Long-term results
• Brand credibility
• Better user experience`,
            
            'trends': `📈 **Digital Marketing Trends 2026:**

1. **AI-Powered Marketing**
   - Generative AI for content
   - Predictive analytics
   - Personalization at scale

2. **Voice Search Optimization**
   - 50% of searches voice-based
   - Natural language keywords
   - Featured snippets focus

3. **Video Marketing**
   - Short-form videos dominate
   - Live streaming growth
   - Interactive content

4. **Privacy-First Marketing**
   - Cookieless tracking
   - First-party data focus
   - Consent management

5. **Social Commerce**
   - In-app purchases
   - Shoppable posts
   - Influencer collaboration`
        };
    }

    attachEvents() {
        // Trigger click
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleContainer();
        });

        // Close button
        this.closeBtn.addEventListener('click', () => {
            this.container.classList.remove('show');
        });

        // Clear chat
        this.clearBtn.addEventListener('click', () => {
            this.clearChat();
        });

        // Input events
        this.input.addEventListener('input', () => {
            this.toggleSendButton();
        });

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                this.sendMessage();
            }
        });

        // Send button
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Suggestions
        this.suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const query = suggestion.getAttribute('data-query');
                this.input.value = query;
                this.toggleSendButton();
                this.sendMessage();
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.container.classList.contains('show') && 
                !this.container.contains(e.target) && 
                !this.trigger.contains(e.target)) {
                this.container.classList.remove('show');
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('show')) {
                this.container.classList.remove('show');
            }
        });
    }

    toggleContainer() {
        this.container.classList.toggle('show');
        if (this.container.classList.contains('show')) {
            this.input.focus();
        }
    }

    toggleSendButton() {
        if (this.input.value.trim()) {
            this.sendBtn.classList.add('active');
            this.sendBtn.disabled = false;
        } else {
            this.sendBtn.classList.remove('active');
            this.sendBtn.disabled = true;
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Disable input
        this.input.disabled = true;
        this.sendBtn.disabled = true;
        this.sendBtn.classList.remove('active');

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing
        this.showTyping();

        try {
            // Try to get AI response
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('API Error:', error);
            this.hideTyping();
            
            // Use fallback response
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        }

        // Enable input
        this.input.disabled = false;
        this.input.focus();
    }

    async getAIResponse(userMessage) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Heranmoy Das Portfolio'
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI assistant for Heranmoy Das's portfolio. You have knowledge about digital marketing and can answer questions professionally."
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.log('Using fallback response system');
            throw error;
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and return appropriate response
        if (lowerMessage.includes('heranmoy') || lowerMessage.includes('about') || lowerMessage.includes('who is')) {
            return this.fallbackResponses.heranmoy;
        }
        else if (lowerMessage.includes('skill') || lowerMessage.includes('expertise') || lowerMessage.includes('know')) {
            return this.fallbackResponses.skills;
        }
        else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('hire')) {
            return this.fallbackResponses.contact;
        }
        else if (lowerMessage.includes('certificate') || lowerMessage.includes('certification') || lowerMessage.includes('qualified')) {
            return this.fallbackResponses.certification;
        }
        else if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('background')) {
            return this.fallbackResponses.experience;
        }
        else if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide')) {
            return this.fallbackResponses.service;
        }
        else if (lowerMessage.includes('digital marketing') || lowerMessage.includes('what is digital')) {
            return this.fallbackResponses['digital marketing'];
        }
        else if (lowerMessage.includes('seo') || lowerMessage.includes('search engine')) {
            return this.fallbackResponses.seo;
        }
        else if (lowerMessage.includes('trend') || lowerMessage.includes('2026') || lowerMessage.includes('latest')) {
            return this.fallbackResponses.trends;
        }
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return `👋 Hello! I'm your AI assistant. I can help you with:

• Information about Heranmoy Das
• Digital Marketing strategies
• SEO tips and techniques
• Latest marketing trends
• Career advice in marketing

What would you like to know?`;
        }
        else {
            return `I understand you're asking about "${message}". 

While I'm currently in offline mode, I can still help with:
• Heranmoy's portfolio and experience
• Digital marketing basics
• SEO and SEM concepts
• Contact information

Could you please ask something related to these topics? 

Or try one of these questions:
• "Who is Heranmoy Das?"
• "What are his skills?"
• "Tell me about SEO"
• "Digital marketing trends 2026"
• "How to contact Heranmoy?"`;
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `smart-ai-message smart-ai-${sender}`;
        
        // Format content
        const formattedContent = this.formatMessage(content);
        
        messageDiv.innerHTML = `
            <div class="smart-ai-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="smart-ai-bubble">
                ${formattedContent}
            </div>
        `;
        
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'smart-ai-message smart-ai-bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="smart-ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="smart-ai-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.messages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        // Convert markdown-style bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert bullet points
        text = text.replace(/•/g, '•');
        
        return `<p>${text}</p>`;
    }

    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('smartAiHistory');
            if (saved) {
                const history = JSON.parse(saved);
                history.slice(-5).forEach(msg => {
                    this.addMessage(msg.content, msg.role);
                });
            }
        } catch (e) {
            console.error('Failed to load history');
        }
    }

    saveHistory() {
        try {
            const messages = [];
            document.querySelectorAll('.smart-ai-message').forEach(msg => {
                const role = msg.classList.contains('smart-ai-user') ? 'user' : 'bot';
                const content = msg.querySelector('.smart-ai-bubble p')?.textContent || '';
                messages.push({ role, content });
            });
            localStorage.setItem('smartAiHistory', JSON.stringify(messages.slice(-10)));
        } catch (e) {
            console.error('Failed to save history');
        }
    }

    clearChat() {
        if (confirm('Clear all messages?')) {
            this.messages.innerHTML = '';
            localStorage.removeItem('smartAiHistory');
            
            // Add welcome message
            this.addMessage(
                "👋 Hi! I'm your AI assistant. I can help you with information about Heranmoy Das and digital marketing. What would you like to know?",
                'bot'
            );
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('smartAiTrigger')) {
        window.smartAI = new SmartAIAssistant();
    }
});