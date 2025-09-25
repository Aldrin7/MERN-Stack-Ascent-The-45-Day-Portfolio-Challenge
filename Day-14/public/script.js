// Blog Platform - Day 14 Complete CMS with Authentication
// Full-stack blogging application with user management

// Global state management
let currentUser = null;
let currentToken = null;
let posts = [];
let categories = ['technology', 'lifestyle', 'travel', 'food', 'business', 'health', 'education', 'entertainment'];

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        me: '/auth/me'
    },
    posts: {
        list: '/posts',
        create: '/posts',
        update: '/posts',
        delete: '/posts',
        search: '/posts/search'
    },
    comments: '/comments',
    users: '/users'
};

// DOM elements cache
const elements = {
    navAuth: document.getElementById('navAuth'),
    navUser: document.getElementById('navUser'),
    navLinks: document.getElementById('navLinks'),
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    featuredPosts: document.getElementById('featuredPosts'),
    recentPosts: document.getElementById('recentPosts'),
    totalPosts: document.getElementById('totalPosts'),
    totalUsers: document.getElementById('totalUsers'),
    totalComments: document.getElementById('totalComments'),
    totalViews: document.getElementById('totalViews')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Blog Platform Initialized');

    // Check for existing authentication
    checkAuthStatus();

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    loadPosts();
    loadStats();

    // Set up form handlers
    setupFormHandlers();

    console.log('✅ Blog Platform Ready');
});

// Authentication Management
function checkAuthStatus() {
    const token = localStorage.getItem('blogToken');
    const user = localStorage.getItem('blogUser');

    if (token && user) {
        try {
            currentToken = token;
            currentUser = JSON.parse(user);
            updateAuthUI(true);
            console.log('🔐 User authenticated:', currentUser.username);
        } catch (error) {
            console.error('Auth status error:', error);
            logout();
        }
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isAuthenticated) {
    if (isAuthenticated && currentUser) {
        // Show user menu
        elements.navAuth.style.display = 'none';
        elements.navUser.style.display = 'flex';

        if (elements.userAvatar) {
            elements.userAvatar.textContent = getUserInitials(currentUser.firstName, currentUser.lastName);
        }
        if (elements.userName) {
            elements.userName.textContent = currentUser.firstName || currentUser.username;
        }

        // Update navigation links for authenticated users
        updateNavForAuth(true);
    } else {
        // Show auth buttons
        elements.navAuth.style.display = 'flex';
        elements.navUser.style.display = 'none';

        // Update navigation links for guests
        updateNavForAuth(false);
    }
}

function updateNavForAuth(isAuthenticated) {
    const navLinks = elements.navLinks.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.textContent.toLowerCase() === 'dashboard') {
            link.style.display = isAuthenticated ? 'block' : 'none';
        }
    });
}

function getUserInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
}

// Event listeners setup
function setupEventListeners() {
    // User menu toggle
    const userMenuBtn = document.querySelector('.user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.querySelector('.user-dropdown');

        if (userMenu && dropdown && !userMenu.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });

    console.log('✅ Event listeners initialized');
}

// Form handlers setup
function setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Create post form
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // Password strength checker
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }

    // Character counters
    setupCharCounters();

    console.log('✅ Form handlers initialized');
}

function setupCharCounters() {
    const titleInput = document.getElementById('postTitle');
    const excerptTextarea = document.getElementById('postExcerpt');

    if (titleInput) {
        titleInput.addEventListener('input', function() {
            updateCharCount('titleCount', this.value.length, 100);
        });
    }

    if (excerptTextarea) {
        excerptTextarea.addEventListener('input', function() {
            updateCharCount('excerptCount', this.value.length, 300);
        });
    }
}

function updateCharCount(elementId, current, max) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `${current}/${max}`;
        element.style.color = current > max ? '#e53e3e' : '#a0aec0';
    }
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        rememberMe: formData.get('rememberMe') === 'on'
    };

    // Clear previous errors
    clearFormErrors('loginForm');

    try {
        showLoading('loginBtn', 'Signing in...');

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.auth.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            // Store authentication data
            currentToken = data.token;
            currentUser = data.user;

            localStorage.setItem('blogToken', currentToken);
            localStorage.setItem('blogUser', JSON.stringify(currentUser));

            // Update UI
            updateAuthUI(true);
            closeModal('loginModal');

            // Reload data
            loadPosts();
            loadStats();

            showNotification('Welcome back!', 'success');

        } else {
            showFormError('loginPassword', data.error || 'Login failed');
        }

    } catch (error) {
        console.error('Login error:', error);
        showFormError('loginPassword', 'Network error. Please try again.');
    } finally {
        hideLoading('loginBtn', 'Sign In');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Validate passwords match
    const confirmPassword = formData.get('confirmPassword');
    if (registerData.password !== confirmPassword) {
        showFormError('confirmPassword', 'Passwords do not match');
        return;
    }

    // Clear previous errors
    clearFormErrors('registerForm');

    try {
        showLoading('registerBtn', 'Creating account...');

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.auth.register}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully! Please log in.', 'success');
            switchToLogin();
        } else {
            // Handle specific validation errors
            if (data.errors) {
                data.errors.forEach(error => {
                    const fieldMap = {
                        'username': 'username',
                        'email': 'registerEmail',
                        'password': 'registerPassword',
                        'firstName': 'firstName',
                        'lastName': 'lastName'
                    };
                    const fieldId = fieldMap[error.field];
                    if (fieldId) {
                        showFormError(fieldId, error.message);
                    }
                });
            } else {
                showFormError('registerEmail', data.error || 'Registration failed');
            }
        }

    } catch (error) {
        console.error('Registration error:', error);
        showFormError('registerEmail', 'Network error. Please try again.');
    } finally {
        hideLoading('registerBtn', 'Create Account');
    }
}

function logout() {
    // Clear stored data
    localStorage.removeItem('blogToken');
    localStorage.removeItem('blogUser');

    // Reset state
    currentToken = null;
    currentUser = null;

    // Update UI
    updateAuthUI(false);

    // Reload data
    loadPosts();
    loadStats();

    showNotification('Logged out successfully', 'info');
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');

    if (!password) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 25;
    } else {
        feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Uppercase letter');
    }

    // Number or special character check
    if (/[\d\W]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('Number or special character');
    }

    // Update UI
    strengthBar.style.width = `${strength}%`;

    if (strength < 25) {
        strengthBar.style.background = '#e53e3e';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#e53e3e';
    } else if (strength < 50) {
        strengthBar.style.background = '#dd6b20';
        strengthText.textContent = 'Fair';
        strengthText.style.color = '#dd6b20';
    } else if (strength < 75) {
        strengthBar.style.background = '#d69e2e';
        strengthText.textContent = 'Good';
        strengthText.style.color = '#d69e2e';
    } else {
        strengthBar.style.background = '#38a169';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#38a169';
    }
}

// Blog Post Management
async function loadPosts() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.posts.list}`);
        const data = await response.json();

        if (response.ok) {
            posts = data.posts || [];
            displayFeaturedPosts();
            displayRecentPosts();
        } else {
            console.error('Failed to load posts:', data.error);
        }
    } catch (error) {
        console.error('Load posts error:', error);
    }
}

function displayFeaturedPosts() {
    if (!elements.featuredPosts) return;

    const featured = posts.filter(post => post.featured).slice(0, 3);

    if (featured.length === 0) {
        elements.featuredPosts.innerHTML = '<div class="empty-state"><span class="empty-icon">⭐</span><p>No featured posts yet</p></div>';
        return;
    }

    const postsHTML = featured.map(post => createPostCard(post)).join('');
    elements.featuredPosts.innerHTML = postsHTML;
}

function displayRecentPosts() {
    if (!elements.recentPosts) return;

    const recent = posts.slice(0, 6);

    if (recent.length === 0) {
        elements.recentPosts.innerHTML = '<div class="empty-state"><span class="empty-icon">📝</span><p>No posts yet</p></div>';
        return;
    }

    const postsHTML = recent.map(post => createPostCard(post)).join('');
    elements.recentPosts.innerHTML = postsHTML;
}

function createPostCard(post) {
    const authorName = post.author?.firstName && post.author?.lastName
        ? `${post.author.firstName} ${post.author.lastName}`
        : post.author?.username || 'Anonymous';

    const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const categoryIcon = getCategoryIcon(post.category);

    return `
        <div class="post-card" onclick="viewPost('${post._id}')">
            <div class="post-image" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                <span style="font-size: 3rem; opacity: 0.8;">📝</span>
            </div>
            <div class="post-content">
                <div class="post-category">
                    <span class="category-icon">${categoryIcon}</span>
                    ${post.category}
                </div>
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <p class="post-excerpt">${escapeHtml(post.excerpt || post.content.substring(0, 150) + '...')}</p>
                <div class="post-meta">
                    <div class="post-author">
                        <span>👤</span>
                        ${authorName}
                    </div>
                    <div class="post-date">${postDate}</div>
                </div>
                <a href="#" class="read-more" onclick="viewPost('${post._id}'); event.stopPropagation();">
                    Read More →
                </a>
            </div>
        </div>
    `;
}

function getCategoryIcon(category) {
    const icons = {
        'technology': '💻',
        'lifestyle': '🌟',
        'travel': '✈️',
        'food': '🍕',
        'business': '💼',
        'health': '🏥',
        'education': '📚',
        'entertainment': '🎬'
    };
    return icons[category] || '📝';
}

function viewPost(postId) {
    // Navigate to post detail view
    showNotification('Post detail view coming soon!', 'info');
}

// Stats Management
async function loadStats() {
    try {
        // Simulate stats loading (would come from API in real app)
        const mockStats = {
            posts: posts.length,
            users: 42,
            comments: 156,
            views: 2847
        };

        updateStatsDisplay(mockStats);
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

function updateStatsDisplay(stats) {
    if (elements.totalPosts) elements.totalPosts.textContent = stats.posts;
    if (elements.totalUsers) elements.totalUsers.textContent = stats.users;
    if (elements.totalComments) elements.totalComments.textContent = stats.comments;
    if (elements.totalViews) elements.totalViews.textContent = stats.views;
}

// Modal Management
function showLoginModal() {
    showModal('loginModal');
    // Clear form
    document.getElementById('loginForm').reset();
    clearFormErrors('loginForm');
}

function showRegisterModal() {
    showModal('registerModal');
    // Clear form
    document.getElementById('registerForm').reset();
    clearFormErrors('registerForm');
    checkPasswordStrength();
}

function showCreatePostModal() {
    if (!currentUser) {
        showNotification('Please log in to create a post', 'warning');
        showLoginModal();
        return;
    }

    showModal('createPostModal');
    // Clear form
    document.getElementById('createPostForm').reset();
    clearFormErrors('createPostForm');
    updateCharCount('titleCount', 0, 100);
    updateCharCount('excerptCount', 0, 300);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

// User Menu Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function showDashboard() {
    showNotification('Dashboard view coming soon!', 'info');
    closeUserMenu();
}

function showProfile() {
    showNotification('Profile view coming soon!', 'info');
    closeUserMenu();
}

function showCreatePost() {
    showCreatePostModal();
    closeUserMenu();
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Navigation Functions
function showHome() {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateActiveNav('home');
}

function showPosts() {
    showNotification('All posts view coming soon!', 'info');
    updateActiveNav('posts');
}

function showCategories() {
    showNotification('Categories view coming soon!', 'info');
    updateActiveNav('categories');
}

function showAbout() {
    showNotification('About page coming soon!', 'info');
}

function updateActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes(activeLink)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function filterByCategory(category) {
    showNotification(`Filtering by ${category}...`, 'info');
    // Would filter posts by category in real implementation
}

function showContact() {
    showNotification('Contact form coming soon!', 'info');
}

function showHelp() {
    showNotification('Help center coming soon!', 'info');
}

function showPrivacy() {
    showNotification('Privacy policy coming soon!', 'info');
}

function showTerms() {
    showNotification('Terms of service coming soon!', 'info');
}

function showGuidelines() {
    showNotification('Community guidelines coming soon!', 'info');
}

function showForgotPassword() {
    showNotification('Password reset coming soon!', 'info');
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if (!email) {
        showNotification('Please enter your email', 'warning');
        return;
    }

    showNotification('Newsletter subscription coming soon!', 'info');
    document.getElementById('newsletterEmail').value = '';
}

// Form Handling
function showFormError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const fieldElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (fieldElement) {
        fieldElement.classList.add('error');
        setTimeout(() => fieldElement.classList.remove('error'), 3000);
    }
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => element.textContent = '');

        const inputElements = form.querySelectorAll('input, select, textarea');
        inputElements.forEach(element => element.classList.remove('error', 'success'));
    }
}

function showLoading(buttonId, text = 'Loading...') {
    const button = document.getElementById(buttonId);
    if (button) {
        const originalText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');

        if (originalText) originalText.textContent = text;
        if (spinner) spinner.style.display = 'inline-block';

        button.disabled = true;
    }
}

function hideLoading(buttonId, originalText = 'Submit') {
    const button = document.getElementById(buttonId);
    if (button) {
        const originalTextElement = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');

        if (originalTextElement) originalTextElement.textContent = originalText;
        if (spinner) spinner.style.display = 'none';

        button.disabled = false;
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;

        const toggleBtn = input.parentElement.querySelector('.password-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
        }
    }
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('show');
    }
}

// Rich Text Editor Functions
function formatText(command) {
    document.execCommand(command, false, null);
}

function insertLink() {
    const url = prompt('Enter the URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage() {
    const url = prompt('Enter the image URL:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);

    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            white-space: pre-line;
        `;
        document.body.appendChild(notification);
    }

    // Set notification style based on type
    const styles = {
        success: { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
        error: { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
        warning: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
        info: { background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }
    };

    const style = styles[type] || styles.info;
    notification.style.background = style.background;
    notification.style.color = style.color;
    notification.style.border = style.border;

    notification.textContent = message;

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize with sample data (for demo purposes)
function initializeSampleData() {
    if (posts.length === 0) {
        posts = [
            {
                _id: '1',
                title: 'Welcome to BlogPlatform',
                excerpt: 'Discover the power of modern blogging with our comprehensive platform.',
                content: 'Full content here...',
                category: 'technology',
                featured: true,
                createdAt: new Date().toISOString(),
                author: { username: 'admin', firstName: 'Admin', lastName: 'User' }
            },
            {
                _id: '2',
                title: 'Getting Started with Web Development',
                excerpt: 'Learn the fundamentals of modern web development.',
                content: 'Full content here...',
                category: 'education',
                featured: false,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                author: { username: 'developer', firstName: 'John', lastName: 'Doe' }
            }
        ];

        displayFeaturedPosts();
        displayRecentPosts();
        loadStats();
    }
}

// Auto-initialize sample data after a short delay
setTimeout(initializeSampleData, 1000);

// Export functions for global access
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.showCreatePostModal = showCreatePostModal;
window.showModal = showModal;
window.closeModal = closeModal;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
window.logout = logout;
window.showHome = showHome;
window.showPosts = showPosts;
window.showCategories = showCategories;
window.showAbout = showAbout;
window.showContact = showContact;
window.showHelp = showHelp;
window.showPrivacy = showPrivacy;
window.showTerms = showTerms;
window.showGuidelines = showGuidelines;
window.showForgotPassword = showForgotPassword;
window.subscribeNewsletter = subscribeNewsletter;
window.toggleUserMenu = toggleUserMenu;
window.showDashboard = showDashboard;
window.showProfile = showProfile;
window.showCreatePost = showCreatePost;
window.filterByCategory = filterByCategory;
window.togglePassword = togglePassword;
window.toggleMobileMenu = toggleMobileMenu;
window.viewPost = viewPost;

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Blog Platform App Ready');
    });
} else {
    console.log('🚀 Blog Platform App Ready');
}
