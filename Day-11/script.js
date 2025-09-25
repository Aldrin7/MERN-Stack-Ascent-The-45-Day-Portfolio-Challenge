// Day 11: Complete CRUD Operations - Update & Delete with MongoDB ObjectId
// Frontend JavaScript for Project Management

// API Base URL - adjust if your server runs on different port
const API_BASE_URL = 'http://localhost:3000';

// Global variables
let currentProjects = [];
let projectToDelete = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Day 11: Complete CRUD Operations Interface Loaded');

    // Initialize form handlers
    initializeFormHandlers();

    // Show welcome message
    showWelcomeMessage();
});

// Initialize form handlers
function initializeFormHandlers() {
    const updateForm = document.getElementById('updateProjectForm');

    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateProject);
    }

    console.log('✅ Form handlers initialized');
}

// Handle project update
async function handleUpdateProject(event) {
    event.preventDefault();

    console.log('📝 Updating project...');

    // Get form data
    const formData = new FormData(event.target);
    const updateData = {
        title: formData.get('title')?.trim(),
        description: formData.get('description')?.trim(),
        technologies: formData.get('technologies')?.split(',').map(tech => tech.trim()).filter(tech => tech),
        category: formData.get('category') || '',
        featured: formData.get('featured') === 'true'
    };

    const projectId = formData.get('projectId')?.trim();

    // Basic client-side validation
    if (!projectId) {
        showNotification('Project ID is required', 'error');
        return;
    }

    if (!updateData.title || !updateData.description) {
        showNotification('Title and description are required', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Updating...';
    submitBtn.disabled = true;

    try {
        // Send PUT request to update project
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Project updated successfully:', result);
            showNotification('Project updated successfully!', 'success');

            // Clear form
            clearUpdateForm();

            // Refresh projects list if visible
            if (document.getElementById('updateProjectsList').style.display !== 'none') {
                loadProjectsForUpdate();
            }

            // Update API results if visible
            updateApiResponse(result);

        } else {
            console.error('❌ Failed to update project:', result.error);

            // Handle specific error cases
            if (response.status === 400) {
                showNotification('Invalid project ID format. Please check the ID.', 'error');
            } else if (response.status === 404) {
                showNotification('Project not found. Please check the ID.', 'error');
            } else {
                showNotification(result.error || 'Failed to update project', 'error');
            }
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

// Handle project deletion
async function deleteProject() {
    const projectId = document.getElementById('deleteProjectId').value?.trim();

    if (!projectId) {
        showNotification('Project ID is required', 'error');
        return;
    }

    // First, try to get project details for confirmation
    try {
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`);
        if (response.ok) {
            const project = await response.json();
            projectToDelete = project;
            showDeleteConfirmation(project);
        } else if (response.status === 404) {
            // Project doesn't exist, proceed with deletion attempt
            projectToDelete = { _id: projectId, title: 'Unknown Project' };
            showDeleteConfirmation(projectToDelete);
        } else {
            throw new Error('Failed to fetch project details');
        }
    } catch (error) {
        console.error('❌ Error fetching project details:', error);
        // Proceed with deletion anyway
        projectToDelete = { _id: projectId, title: 'Unknown Project' };
        showDeleteConfirmation(projectToDelete);
    }
}

// Show delete confirmation modal
function showDeleteConfirmation(project) {
    const modal = document.getElementById('deleteModal');
    const projectInfo = document.getElementById('deleteProjectInfo');

    if (modal && projectInfo) {
        projectInfo.innerHTML = `
            <p><strong>Project ID:</strong> <span class="project-id">${project._id}</span></p>
            <p><strong>Title:</strong> ${project.title || 'Unknown'}</p>
            <p><strong>Description:</strong> ${project.description || 'No description'}</p>
        `;

        modal.classList.add('show');
    }
}

// Confirm and execute deletion
async function confirmDelete() {
    if (!projectToDelete) return;

    const projectId = projectToDelete._id;

    // Close modal
    closeModal();

    // Show loading state
    const deleteBtn = document.querySelector('button[onclick="deleteProject()"]');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<span class="spinner"></span> Deleting...';
    deleteBtn.disabled = true;

    try {
        // Send DELETE request
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            // 204 No Content - successful deletion
            console.log('✅ Project deleted successfully (204 No Content)');
            showNotification('Project deleted successfully!', 'success');

            // Clear form
            clearDeleteForm();

            // Refresh projects list if visible
            if (document.getElementById('deleteProjectsList').style.display !== 'none') {
                loadProjectsForDelete();
            }

            // Update API results
            updateApiResponse({ status: 204, message: 'Project deleted successfully' });

        } else {
            const result = await response.json();
            console.error('❌ Failed to delete project:', result.error);

            // Handle specific error cases
            if (response.status === 400) {
                showNotification('Invalid project ID format. Please check the ID.', 'error');
            } else if (response.status === 404) {
                showNotification('Project not found. It may have already been deleted.', 'error');
            } else {
                showNotification(result.error || 'Failed to delete project', 'error');
            }
        }

    } catch (error) {
        console.error('❌ Network error:', error);
        showNotification('Network error - check if server is running', 'error');
    } finally {
        // Reset button state
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
        projectToDelete = null;
    }
}

// Cancel deletion
function cancelDelete() {
    closeModal();
    projectToDelete = null;
}

// Load projects for update operations
async function loadProjectsForUpdate() {
    console.log('📝 Loading projects for update...');

    const container = document.getElementById('updateProjectsContainer');
    const listDiv = document.getElementById('updateProjectsList');

    if (!container || !listDiv) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const result = await response.json();

        if (response.ok && result.success) {
            currentProjects = result.data;
            displayProjectsForUpdate(result.data);
            listDiv.style.display = 'block';
        } else {
            throw new Error(result.error || 'Failed to load projects');
        }

    } catch (error) {
        console.error('❌ Error loading projects for update:', error);
        container.innerHTML = '<p class="error-message">Failed to load projects. Make sure the server is running.</p>';
        listDiv.style.display = 'block';
    }
}

// Load projects for delete operations
async function loadProjectsForDelete() {
    console.log('🗑️ Loading projects for deletion...');

    const container = document.getElementById('deleteProjectsContainer');
    const listDiv = document.getElementById('deleteProjectsList');

    if (!container || !listDiv) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const result = await response.json();

        if (response.ok && result.success) {
            displayProjectsForDelete(result.data);
            listDiv.style.display = 'block';
        } else {
            throw new Error(result.error || 'Failed to load projects');
        }

    } catch (error) {
        console.error('❌ Error loading projects for delete:', error);
        container.innerHTML = '<p class="error-message">Failed to load projects. Make sure the server is running.</p>';
        listDiv.style.display = 'block';
    }
}

// Display projects for update
function displayProjectsForUpdate(projects) {
    const container = document.getElementById('updateProjectsContainer');

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects available for update.</p>';
        return;
    }

    const projectsHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <span class="project-id" onclick="fillUpdateForm('${project._id}')">${project._id.substring(0, 8)}...</span>
            </div>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-meta">
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${project.category || 'Uncategorized'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Featured</div>
                    <div class="meta-value">${project.featured ? 'Yes' : 'No'}</div>
                </div>
            </div>
            ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="project-actions">
                <button class="project-action update" onclick="fillUpdateForm('${project._id}')">
                    📝 Use for Update
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = projectsHTML;
}

// Display projects for delete
function displayProjectsForDelete(projects) {
    const container = document.getElementById('deleteProjectsContainer');

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects available for deletion.</p>';
        return;
    }

    const projectsHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <span class="project-id" onclick="fillDeleteForm('${project._id}')">${project._id.substring(0, 8)}...</span>
            </div>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-meta">
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${project.category || 'Uncategorized'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Featured</div>
                    <div class="meta-value">${project.featured ? 'Yes' : 'No'}</div>
                </div>
            </div>
            <div class="project-actions">
                <button class="project-action delete" onclick="fillDeleteForm('${project._id}')">
                    🗑️ Use for Delete
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = projectsHTML;
}

// Fill update form with project ID
function fillUpdateForm(projectId) {
    document.getElementById('updateProjectId').value = projectId;
    showNotification('Project ID copied to update form', 'info');

    // Scroll to update form
    document.getElementById('updateProjectForm').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Fill delete form with project ID
function fillDeleteForm(projectId) {
    document.getElementById('deleteProjectId').value = projectId;
    showNotification('Project ID copied to delete form', 'info');

    // Scroll to delete form
    document.getElementById('deleteProjectId').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Clear update form
function clearUpdateForm() {
    const form = document.getElementById('updateProjectForm');
    if (form) {
        form.reset();
        console.log('📝 Update form cleared');
    }
}

// Clear delete form
function clearDeleteForm() {
    const input = document.getElementById('deleteProjectId');
    if (input) {
        input.value = '';
        console.log('🗑️ Delete form cleared');
    }
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

// Test PUT /api/projects/:id
async function testPutProject() {
    console.log('🧪 Testing PUT /api/projects/:id');

    const testData = {
        title: 'Updated Test Project',
        description: 'This project was updated via API testing',
        technologies: ['JavaScript', 'Node.js', 'Testing'],
        category: 'backend',
        featured: true
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects/507f1f77bcf86cd799439011`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        updateApiResponse(result);

        if (response.ok && result.success) {
            showNotification('PUT test successful!', 'success');
        } else if (response.status === 404) {
            showNotification('PUT test: Project not found (expected for test ID)', 'info');
        } else {
            showNotification('PUT test completed with error', 'error');
        }

    } catch (error) {
        console.error('❌ PUT test failed:', error);
        updateApiResponse({ error: 'Network error', details: error.message });
        showNotification('PUT test failed', 'error');
    }
}

// Test DELETE /api/projects/:id
async function testDeleteProject() {
    console.log('🧪 Testing DELETE /api/projects/:id');

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects/507f1f77bcf86cd799439011`, {
            method: 'DELETE'
        });

        let result;
        if (response.status === 204) {
            result = { status: 204, message: 'Project deleted successfully (No Content)' };
        } else {
            result = await response.json();
        }

        updateApiResponse(result);

        if (response.status === 204) {
            showNotification('DELETE test successful (204 No Content)!', 'success');
        } else if (response.status === 404) {
            showNotification('DELETE test: Project not found (expected for test ID)', 'info');
        } else {
            showNotification('DELETE test completed with error', 'error');
        }

    } catch (error) {
        console.error('❌ DELETE test failed:', error);
        updateApiResponse({ error: 'Network error', details: error.message });
        showNotification('DELETE test failed', 'error');
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

function showStatusCodes() {
    const modal = document.getElementById('statusCodesModal');
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
        showNotification('Welcome to Day 11: Complete CRUD Operations! Test Update & Delete operations.', 'info');
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
    // Escape key to close modals
    if (event.key === 'Escape') {
        closeModal();
    }

    // Ctrl/Cmd + U to focus update form
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault();
        document.getElementById('updateProjectId').focus();
    }

    // Ctrl/Cmd + D to focus delete form
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        document.getElementById('deleteProjectId').focus();
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
const originalHandleUpdateProject = handleUpdateProject;
handleUpdateProject = async function(event) {
    startPerformanceMark('updateProject');
    const result = await originalHandleUpdateProject.apply(this, arguments);
    endPerformanceMark('updateProject');
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
window.loadProjectsForUpdate = loadProjectsForUpdate;
window.loadProjectsForDelete = loadProjectsForDelete;
window.fillUpdateForm = fillUpdateForm;
window.fillDeleteForm = fillDeleteForm;
window.deleteProject = deleteProject;
window.confirmDelete = confirmDelete;
window.cancelDelete = cancelDelete;
window.clearUpdateForm = clearUpdateForm;
window.clearDeleteForm = clearDeleteForm;
window.testGetProjects = testGetProjects;
window.testPutProject = testPutProject;
window.testDeleteProject = testDeleteProject;
window.showInstructions = showInstructions;
window.showStatusCodes = showStatusCodes;
window.closeModal = closeModal;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('🚀 Complete CRUD Operations Interface Initialized');
    console.log('💡 Tips:');
    console.log('   - Use Ctrl+U to focus update form');
    console.log('   - Use Ctrl+D to focus delete form');
    console.log('   - Press Escape to close modals');
    console.log('   - Check browser Network tab for HTTP status codes');
    console.log('   - Test with invalid ObjectIds to see 400 errors');
    console.log('   - Try deleting non-existent projects to see 404 errors');
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
