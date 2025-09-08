// Day 10: CRUD Operations - Create & Read with MongoDB
// Frontend JavaScript for Project Management

// API Base URL - adjust if your server runs on different port
const API_BASE_URL = 'http://localhost:3000';

// Global variables
let currentProjects = [];
let filteredProjects = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Day 10: CRUD Operations Interface Loaded');

    // Initialize form handlers
    initializeFormHandlers();

    // Show welcome message
    showWelcomeMessage();
});

// Initialize form handlers
function initializeFormHandlers() {
    const createForm = document.getElementById('createProjectForm');

    if (createForm) {
        createForm.addEventListener('submit', handleCreateProject);
    }

    console.log('✅ Form handlers initialized');
}

// Handle project creation
async function handleCreateProject(event) {
    event.preventDefault();

    console.log('📝 Creating new project...');

    // Get form data
    const formData = new FormData(event.target);
    const projectData = {
        title: formData.get('title')?.trim(),
        description: formData.get('description')?.trim(),
        technologies: formData.get('technologies')?.split(',').map(tech => tech.trim()).filter(tech => tech),
        category: formData.get('category') || '',
        featured: formData.get('featured') === 'true',
        githubUrl: formData.get('githubUrl')?.trim() || '',
        liveUrl: formData.get('liveUrl')?.trim() || ''
    };

    // Basic client-side validation
    if (!projectData.title || !projectData.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating...';
    submitBtn.disabled = true;

    try {
        // Send POST request to create project
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Project created successfully:', result.data);
            showNotification('Project created successfully!', 'success');

            // Clear form
            clearForm();

            // Refresh projects list if visible
            if (document.getElementById('projectsContainer').innerHTML !== '<div class="loading-message"><p>Click "Load Projects" to fetch data from the API</p></div>') {
                loadProjects();
            }

            // Update API results if visible
            updateApiResponse(result);

        } else {
            console.error('❌ Failed to create project:', result.error);
            showNotification(result.error || 'Failed to create project', 'error');
        }

    } catch (error) {
        console.error('❌ Network error:', error);
        showNotification('Network error - check if server is running', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load projects from API
async function loadProjects() {
    console.log('📖 Loading projects from API...');

    const container = document.getElementById('projectsContainer');
    const loadBtn = document.querySelector('button[onclick="loadProjects()"]');

    // Show loading state
    if (loadBtn) {
        loadBtn.innerHTML = '<span class="spinner"></span> Loading...';
        loadBtn.disabled = true;
    }

    container.innerHTML = '<div class="loading-message"><p><span class="spinner"></span> Loading projects...</p></div>';

    try {
        // Send GET request to fetch projects
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Projects loaded successfully:', result.data);
            currentProjects = result.data;
            filteredProjects = [...currentProjects];

            // Update API results if visible
            updateApiResponse(result);

            // Display projects
            displayProjects(filteredProjects);

            // Update stats
            updateProjectStats(result);

        } else {
            console.error('❌ Failed to load projects:', result.error);
            container.innerHTML = '<div class="loading-message"><p>❌ Failed to load projects</p><p>Please check if the server is running</p></div>';
            showNotification(result.error || 'Failed to load projects', 'error');
        }

    } catch (error) {
        console.error('❌ Network error:', error);
        container.innerHTML = '<div class="loading-message"><p>❌ Network error</p><p>Check if server is running on port 3000</p></div>';
        showNotification('Network error - check if server is running', 'error');
    } finally {
        // Reset button state
        if (loadBtn) {
            loadBtn.innerHTML = '<span class="btn-icon">🔄</span> Load Projects';
            loadBtn.disabled = false;
        }
    }
}

// Display projects in the UI
function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');

    if (projects.length === 0) {
        container.innerHTML = '<div class="loading-message"><p>No projects found</p></div>';
        return;
    }

    const projectsHTML = projects.map(project => createProjectCard(project)).join('');
    container.innerHTML = projectsHTML;

    console.log(`📊 Displayed ${projects.length} projects`);
}

// Create project card HTML
function createProjectCard(project) {
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown';

    return `
        <div class="project-card" data-project-id="${project._id}">
            <div class="project-header">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <span class="project-category">${project.category || 'Uncategorized'}</span>
            </div>

            <p class="project-description">${escapeHtml(project.description)}</p>

            <div class="project-meta">
                <div class="meta-item">
                    <div class="meta-label">Featured</div>
                    <div class="meta-value">${project.featured ? '⭐ Yes' : 'No'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Created</div>
                    <div class="meta-value">${createdDate}</div>
                </div>
            </div>

            ${technologies.length > 0 ? `
                <div class="technologies">
                    ${technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
            ` : ''}

            <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">💻 GitHub</a>` : ''}
                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link">🌐 Live Demo</a>` : ''}
            </div>

            <div class="project-timestamp">
                Project ID: ${project._id}
            </div>
        </div>
    `;
}

// Filter projects by category
function filterProjects() {
    const categoryFilter = document.getElementById('filterCategory').value;

    if (categoryFilter === '') {
        filteredProjects = [...currentProjects];
    } else {
        filteredProjects = currentProjects.filter(project =>
            project.category === categoryFilter
        );
    }

    displayProjects(filteredProjects);
    console.log(`🔍 Filtered to ${filteredProjects.length} projects`);
}

// Clear projects display
function clearProjects() {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '<div class="loading-message"><p>Click "Load Projects" to fetch data from the API</p></div>';

    // Reset filter
    document.getElementById('filterCategory').value = '';
    currentProjects = [];
    filteredProjects = [];

    console.log('🗑️ Projects display cleared');
}

// Clear create project form
function clearForm() {
    const form = document.getElementById('createProjectForm');
    if (form) {
        form.reset();
        console.log('📝 Form cleared');
    }
}

// Update project statistics
function updateProjectStats(result) {
    // You can add more stats display here if needed
    console.log(`📊 Total projects: ${result.count}, Available: ${result.total}`);
}

// API Testing Functions

// Test GET /api/projects
async function testGetProjects() {
    console.log('🧪 Testing GET /api/projects');

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const result = await response.json();

        updateApiResponse(result);
        showNotification('GET test completed!', 'success');

    } catch (error) {
        console.error('❌ GET test failed:', error);
        updateApiResponse({ error: 'Network error', details: error.message });
        showNotification('GET test failed', 'error');
    }
}

// Test POST /api/projects
async function testPostProject() {
    console.log('🧪 Testing POST /api/projects');

    const testProject = {
        title: 'Test Project - API Testing',
        description: 'This is a test project created via API testing',
        technologies: ['JavaScript', 'Node.js', 'Testing'],
        category: 'backend',
        featured: true
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProject)
        });

        const result = await response.json();
        updateApiResponse(result);

        if (response.ok && result.success) {
            showNotification('POST test successful!', 'success');
        } else {
            showNotification('POST test failed', 'error');
        }

    } catch (error) {
        console.error('❌ POST test failed:', error);
        updateApiResponse({ error: 'Network error', details: error.message });
        showNotification('POST test failed', 'error');
    }
}

// Update API response display
function updateApiResponse(data) {
    const responseElement = document.getElementById('apiResponse');
    if (responseElement) {
        responseElement.textContent = JSON.stringify(data, null, 2);
    }
}

// Modal Functions
function showInstructions() {
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function showAPIDocs() {
    const modal = document.getElementById('apiDocsModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('show'));
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Utility Functions

// Show notification messages
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

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show welcome message
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Welcome to Day 10: CRUD Operations! Start by creating a project or loading existing ones.', 'info');
    }, 1000);
}

// Error handling for fetch requests
function handleFetchError(error, operation) {
    console.error(`❌ ${operation} error:`, error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showNotification('Cannot connect to server. Make sure it\'s running on port 3000', 'error');
    } else {
        showNotification(`${operation} failed: ${error.message}`, 'error');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const activeForm = document.activeElement.closest('form');
        if (activeForm && activeForm.id === 'createProjectForm') {
            event.preventDefault();
            activeForm.requestSubmit();
        }
    }

    // Escape key to close modals
    if (event.key === 'Escape') {
        closeModal();
    }

    // Ctrl/Cmd + L to load projects
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        loadProjects();
    }
});

// Performance monitoring
const performanceMarks = {};

function startPerformanceMark(name) {
    performanceMarks[name] = performance.now();
}

function endPerformanceMark(name) {
    if (performanceMarks[name]) {
        const duration = performance.now() - performanceMarks[name];
        console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
        delete performanceMarks[name];
    }
}

// Add performance monitoring to key functions
const originalLoadProjects = loadProjects;
loadProjects = async function() {
    startPerformanceMark('loadProjects');
    const result = await originalLoadProjects.apply(this, arguments);
    endPerformanceMark('loadProjects');
    return result;
};

// Console logging helper
function logToConsole(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}`;

    switch (type) {
        case 'error':
            console.error(formattedMessage);
            break;
        case 'warn':
            console.warn(formattedMessage);
            break;
        case 'info':
            console.info(formattedMessage);
            break;
        default:
            console.log(formattedMessage);
    }
}

// Override console methods to add timestamps
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

console.log = function(...args) {
    originalConsoleLog.apply(console, [`[${new Date().toLocaleTimeString()}]`, ...args]);
};

console.error = function(...args) {
    originalConsoleError.apply(console, [`[${new Date().toLocaleTimeString()}] ERROR:`, ...args]);
};

console.warn = function(...args) {
    originalConsoleWarn.apply(console, [`[${new Date().toLocaleTimeString()}] WARN:`, ...args]);
};

console.info = function(...args) {
    originalConsoleInfo.apply(console, [`[${new Date().toLocaleTimeString()}] INFO:`, ...args]);
};

// Export functions for global access (for inline onclick handlers)
window.loadProjects = loadProjects;
window.clearProjects = clearProjects;
window.filterProjects = filterProjects;
window.testGetProjects = testGetProjects;
window.testPostProject = testPostProject;
window.clearForm = clearForm;
window.showInstructions = showInstructions;
window.showAPIDocs = showAPIDocs;
window.closeModal = closeModal;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('🚀 CRUD Operations Interface Initialized');
    console.log('💡 Tips:');
    console.log('   - Use Ctrl+L to quickly load projects');
    console.log('   - Use Ctrl+Enter in form to submit');
    console.log('   - Press Escape to close modals');
    console.log('   - Check browser console for detailed logs');
}

// Graceful error handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred', 'error');
});

window.addEventListener('error', function(event) {
    console.error('🚨 JavaScript error:', event.error);
    showNotification('A JavaScript error occurred', 'error');
});
