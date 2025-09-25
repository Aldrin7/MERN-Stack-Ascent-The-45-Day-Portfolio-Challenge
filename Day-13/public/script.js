// ===================================================
// Day 13: Work Experience API - Interactive Frontend
// ===================================================
// Complete CRUD Operations with Modern JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/work-experience';
let currentExperienceId = null;
let allExperiences = [];

// DOM Elements
const serverStatus = document.getElementById('serverStatus');
const serverText = document.getElementById('serverText');
const workExperienceForm = document.getElementById('workExperienceForm');
const experiencesList = document.getElementById('experiencesList');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editForm = document.getElementById('editForm');
const notifications = document.getElementById('notifications');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    checkServerStatus();
});

function initializeApp() {
    // Form event listeners
    workExperienceForm.addEventListener('submit', handleCreateExperience);
    editForm.addEventListener('submit', handleUpdateExperience);

    // Filter event listeners
    document.getElementById('filterCurrent').addEventListener('change', filterExperiences);
    document.getElementById('searchCompany').addEventListener('input', searchExperiences);

    // Load initial data
    loadExperiences();

    console.log('🚀 Work Experience API Frontend Initialized');
}

// ===================================================
// SERVER STATUS MANAGEMENT
// ===================================================

async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}?limit=1`);
        if (response.ok) {
            serverStatus.classList.add('connected');
            serverText.textContent = 'Server Connected';
            showNotification('Server Connected', 'API is running successfully', 'success');
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        console.error('Server check failed:', error);
        serverStatus.classList.remove('connected');
        serverText.textContent = 'Server Offline';
        showNotification('Server Offline', 'Unable to connect to API server', 'error');
    }
}

// ===================================================
// CRUD OPERATIONS
// ===================================================

// CREATE - Add new work experience
async function handleCreateExperience(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const experienceData = {
        company: formData.get('company').trim(),
        position: formData.get('position').trim(),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        current: formData.get('current') === 'on',
        description: formData.get('description').trim(),
        technologies: formData.get('technologies')
            ? formData.get('technologies').split(',').map(tech => tech.trim()).filter(Boolean)
            : [],
        achievements: formData.get('achievements')
            ? formData.get('achievements').split(',').map(achievement => achievement.trim()).filter(Boolean)
            : []
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(experienceData)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Success', result.message, 'success');
            event.target.reset();
            loadExperiences();
        } else {
            showNotification('Error', result.message || 'Failed to create experience', 'error');
            if (result.errors) {
                displayFormErrors(result.errors);
            }
        }
    } catch (error) {
        console.error('Create error:', error);
        showNotification('Error', 'Network error occurred', 'error');
    }
}

// READ - Load all work experiences
async function loadExperiences() {
    showLoading();

    try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();

        if (response.ok) {
            allExperiences = result.data || [];
            renderExperiences(allExperiences);
        } else {
            showNotification('Error', result.message || 'Failed to load experiences', 'error');
            showEmptyState();
        }
    } catch (error) {
        console.error('Load error:', error);
        showNotification('Error', 'Network error occurred', 'error');
        showEmptyState();
    } finally {
        hideLoading();
    }
}

// UPDATE - Edit work experience
async function handleUpdateExperience(event) {
    event.preventDefault();

    if (!currentExperienceId) return;

    const formData = new FormData(event.target);
    const experienceData = {
        company: formData.get('company').trim(),
        position: formData.get('position').trim(),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        current: document.getElementById('editCurrent').checked,
        description: formData.get('description').trim(),
        technologies: formData.get('technologies')
            ? formData.get('technologies').split(',').map(tech => tech.trim()).filter(Boolean)
            : [],
        achievements: formData.get('achievements')
            ? formData.get('achievements').split(',').map(achievement => achievement.trim()).filter(Boolean)
            : []
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${currentExperienceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(experienceData)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Success', result.message, 'success');
            closeModal('editModal');
            loadExperiences();
        } else {
            showNotification('Error', result.message || 'Failed to update experience', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification('Error', 'Network error occurred', 'error');
    }
}

// DELETE - Remove work experience
async function deleteExperience(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Success', result.message, 'success');
            closeModal('deleteModal');
            loadExperiences();
        } else {
            showNotification('Error', result.message || 'Failed to delete experience', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Error', 'Network error occurred', 'error');
    }
}

// ===================================================
// UI RENDERING FUNCTIONS
// ===================================================

function renderExperiences(experiences) {
    if (experiences.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    experiencesList.innerHTML = '';

    experiences.forEach(experience => {
        const experienceCard = createExperienceCard(experience);
        experiencesList.appendChild(experienceCard);
    });
}

function createExperienceCard(experience) {
    const card = document.createElement('div');
    card.className = 'experience-card';

    const startDate = new Date(experience.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });

    const endDate = experience.endDate
        ? new Date(experience.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        })
        : experience.current ? 'Present' : 'N/A';

    const technologies = experience.technologies || [];
    const achievements = experience.achievements || [];

    card.innerHTML = `
        <div class="experience-header">
            <div>
                <h3 class="experience-company">${experience.company}</h3>
                <p class="experience-position">${experience.position}</p>
            </div>
        </div>

        <div class="experience-dates">
            ${startDate} - ${endDate} ${experience.current ? '(Current)' : ''}
        </div>

        ${experience.description ? `
            <div class="experience-description">
                ${experience.description}
            </div>
        ` : ''}

        ${technologies.length > 0 ? `
            <div class="experience-tech">
                ${technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        ` : ''}

        ${achievements.length > 0 ? `
            <div class="experience-description">
                <strong>Achievements:</strong> ${achievements.join(', ')}
            </div>
        ` : ''}

        <div class="experience-actions">
            <button class="action-btn edit" onclick="openEditModal('${experience._id}')">
                ✏️ Edit
            </button>
            <button class="action-btn delete" onclick="openDeleteModal('${experience._id}', '${experience.company}')">
                🗑️ Delete
            </button>
        </div>
    `;

    return card;
}

// ===================================================
// FILTERING & SEARCH FUNCTIONS
// ===================================================

function filterExperiences() {
    const filterValue = document.getElementById('filterCurrent').value;
    let filteredExperiences = [...allExperiences];

    if (filterValue === 'true') {
        filteredExperiences = allExperiences.filter(exp => exp.current);
    } else if (filterValue === 'false') {
        filteredExperiences = allExperiences.filter(exp => !exp.current);
    }

    renderExperiences(filteredExperiences);
}

function searchExperiences() {
    const searchTerm = document.getElementById('searchCompany').value.toLowerCase();
    const filterValue = document.getElementById('filterCurrent').value;

    let filteredExperiences = [...allExperiences];

    // Apply current filter first
    if (filterValue === 'true') {
        filteredExperiences = filteredExperiences.filter(exp => exp.current);
    } else if (filterValue === 'false') {
        filteredExperiences = filteredExperiences.filter(exp => !exp.current);
    }

    // Apply search filter
    if (searchTerm) {
        filteredExperiences = filteredExperiences.filter(exp =>
            exp.company.toLowerCase().includes(searchTerm) ||
            exp.position.toLowerCase().includes(searchTerm)
        );
    }

    renderExperiences(filteredExperiences);
}

// ===================================================
// MODAL MANAGEMENT
// ===================================================

function openEditModal(id) {
    const experience = allExperiences.find(exp => exp._id === id);
    if (!experience) return;

    currentExperienceId = id;

    // Populate form
    document.getElementById('editId').value = experience._id;
    document.getElementById('editCompany').value = experience.company;
    document.getElementById('editPosition').value = experience.position;
    document.getElementById('editStartDate').value = experience.startDate.split('T')[0];
    document.getElementById('editEndDate').value = experience.endDate ? experience.endDate.split('T')[0] : '';
    document.getElementById('editCurrent').checked = experience.current;
    document.getElementById('editDescription').value = experience.description || '';
    document.getElementById('editTechnologies').value = experience.technologies ? experience.technologies.join(', ') : '';
    document.getElementById('editAchievements').value = experience.achievements ? experience.achievements.join(', ') : '';

    editModal.classList.add('show');
}

function openDeleteModal(id, company) {
    currentExperienceId = id;
    document.getElementById('deleteItemInfo').innerHTML = `
        <strong>${company}</strong><br>
        This action cannot be undone.
    `;
    deleteModal.classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    currentExperienceId = null;
}

function confirmDelete() {
    if (currentExperienceId) {
        deleteExperience(currentExperienceId);
    }
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

function showLoading() {
    loadingIndicator.style.display = 'block';
    experiencesList.style.display = 'none';
    emptyState.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
    experiencesList.style.display = 'grid';
}

function showEmptyState() {
    experiencesList.style.display = 'none';
    emptyState.style.display = 'block';
}

function hideEmptyState() {
    experiencesList.style.display = 'grid';
    emptyState.style.display = 'none';
}

function clearForm() {
    workExperienceForm.reset();
    // Clear any form errors
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.remove());
}

function displayFormErrors(errors) {
    // Clear previous errors
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.remove());

    // Display new errors
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        `;
        errorElement.textContent = error;

        // Try to find the related input
        const inputs = document.querySelectorAll('input, select, textarea');
        const relatedInput = Array.from(inputs).find(input =>
            input.name.toLowerCase().includes(error.toLowerCase().split(' ')[0])
        );

        if (relatedInput) {
            relatedInput.parentNode.appendChild(errorElement);
        }
    });
}

// ===================================================
// NOTIFICATION SYSTEM
// ===================================================

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    notifications.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===================================================
// EVENT LISTENERS
// ===================================================

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('editModal');
        closeModal('deleteModal');
    }
});

// ===================================================
// INITIALIZATION LOG
// ===================================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🚀 WORK EXPERIENCE API                    ║
║                      Frontend Initialized                     ║
╠══════════════════════════════════════════════════════════════╣
║ ✅ DOM Content Loaded                                        ║
║ ✅ Event Listeners Attached                                  ║
║ ✅ Server Status Check Initiated                             ║
║ ✅ Initial Data Load Started                                 ║
║ ✅ Notification System Ready                                 ║
╚══════════════════════════════════════════════════════════════╝
`);

// Export functions for global access (if needed)
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.closeModal = closeModal;
window.confirmDelete = confirmDelete;
window.clearForm = clearForm;
