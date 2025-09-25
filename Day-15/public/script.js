/* Day 15: TaskFlow - Complete Task Management System with Teams */
/* Advanced JavaScript with Real-time Features and Team Collaboration */

// Global State Management
let currentUser = {
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: '👤'
};

let currentProject = {
    id: 1,
    name: 'TaskFlow Development',
    description: 'Complete task management system',
    members: [
        { id: 1, name: 'John Doe', role: 'Lead Developer', avatar: '👤' },
        { id: 2, name: 'Jane Smith', role: 'UI Designer', avatar: '👩' },
        { id: 3, name: 'Mike Johnson', role: 'Backend Developer', avatar: '👨' },
        { id: 4, name: 'Sarah Wilson', role: 'Product Manager', avatar: '👩‍💼' }
    ]
};

let tasks = [
    {
        id: 1,
        title: 'Implement user authentication',
        description: 'Set up JWT authentication system with login/register',
        status: 'in-progress',
        priority: 'high',
        assignee: { id: 1, name: 'John Doe', avatar: '👤' },
        dueDate: '2025-08-30',
        labels: ['backend', 'security'],
        createdAt: '2025-08-25',
        updatedAt: '2025-08-28'
    },
    {
        id: 2,
        title: 'Design dashboard UI',
        description: 'Create responsive dashboard layout with statistics',
        status: 'review',
        priority: 'medium',
        assignee: { id: 2, name: 'Jane Smith', avatar: '👩' },
        dueDate: '2025-09-02',
        labels: ['frontend', 'ui'],
        createdAt: '2025-08-24',
        updatedAt: '2025-08-27'
    },
    {
        id: 3,
        title: 'Set up project structure',
        description: 'Initialize project with proper folder structure',
        status: 'done',
        priority: 'high',
        assignee: { id: 1, name: 'John Doe', avatar: '👤' },
        dueDate: '2025-08-20',
        labels: ['setup'],
        createdAt: '2025-08-20',
        updatedAt: '2025-08-20'
    },
    {
        id: 4,
        title: 'Implement drag & drop',
        description: 'Add drag and drop functionality to kanban board',
        status: 'todo',
        priority: 'medium',
        assignee: { id: 3, name: 'Mike Johnson', avatar: '👨' },
        dueDate: '2025-09-05',
        labels: ['frontend', 'javascript'],
        createdAt: '2025-08-26',
        updatedAt: '2025-08-26'
    },
    {
        id: 5,
        title: 'Write API documentation',
        description: 'Document all REST API endpoints',
        status: 'todo',
        priority: 'low',
        assignee: { id: 1, name: 'John Doe', avatar: '👤' },
        dueDate: '2025-09-10',
        labels: ['documentation'],
        createdAt: '2025-08-27',
        updatedAt: '2025-08-27'
    }
];

let teams = [
    {
        id: 1,
        name: 'Development Team',
        description: 'Main development team for web applications',
        memberCount: 8,
        projectCount: 3,
        avatar: '🚀',
        members: [
            { id: 1, name: 'John Doe', role: 'Lead Developer' },
            { id: 2, name: 'Jane Smith', role: 'UI Designer' },
            { id: 3, name: 'Mike Johnson', role: 'Backend Developer' }
        ]
    },
    {
        id: 2,
        name: 'Design Team',
        description: 'UI/UX and graphic design team',
        memberCount: 5,
        projectCount: 2,
        avatar: '🎨',
        members: [
            { id: 2, name: 'Jane Smith', role: 'Lead Designer' },
            { id: 4, name: 'Sarah Wilson', role: 'Product Designer' }
        ]
    }
];

let activities = [
    {
        id: 1,
        type: 'task_created',
        message: 'John created task "Implement user authentication"',
        timestamp: '2025-08-28T10:30:00Z',
        user: { name: 'John Doe', avatar: '👤' }
    },
    {
        id: 2,
        type: 'task_completed',
        message: 'Jane completed task "Fix login bug"',
        timestamp: '2025-08-28T09:15:00Z',
        user: { name: 'Jane Smith', avatar: '👩' }
    },
    {
        id: 3,
        type: 'task_moved',
        message: 'Mike moved task "Set up project structure" to Done',
        timestamp: '2025-08-28T08:45:00Z',
        user: { name: 'Mike Johnson', avatar: '👨' }
    }
];

// DOM Elements Cache
const elements = {
    // Views
    dashboardView: document.getElementById('dashboardView'),
    boardView: document.getElementById('boardView'),
    teamsView: document.getElementById('teamsView'),
    analyticsView: document.getElementById('analyticsView'),

    // Dashboard
    totalTasks: document.getElementById('totalTasks'),
    completedTasks: document.getElementById('completedTasks'),
    activeTeams: document.getElementById('activeTeams'),
    activeProjects: document.getElementById('activeProjects'),
    myTasks: document.getElementById('myTasks'),
    recentActivity: document.getElementById('recentActivity'),
    myTeams: document.getElementById('myTeams'),

    // Kanban Board
    kanbanBoard: document.getElementById('kanbanBoard'),
    boardTitle: document.getElementById('boardTitle'),
    boardDescription: document.getElementById('boardDescription'),
    projectMembers: document.getElementById('projectMembers'),
    todoCount: document.getElementById('todoCount'),
    inProgressCount: document.getElementById('inProgressCount'),
    reviewCount: document.getElementById('reviewCount'),
    doneCount: document.getElementById('doneCount'),

    // Teams
    teamsList: document.getElementById('teamsList'),

    // Search
    searchInput: document.getElementById('globalSearch'),

    // User menu
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    userDropdown: document.getElementById('userDropdown'),

    // Modals
    createTaskModal: document.getElementById('createTaskModal'),
    createTeamModal: document.getElementById('createTeamModal'),
    taskDetailsModal: document.getElementById('taskDetailsModal'),

    // Notifications
    notifications: document.getElementById('notifications')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TaskFlow Initialized');

    // Set up event listeners
    setupEventListeners();

    // Initialize UI
    initializeUI();

    // Load initial data
    loadDashboardData();

    // Set up real-time updates simulation
    setupRealtimeUpdates();

    console.log('✅ TaskFlow Ready');
});

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('onclick').match(/'([^']+)'/)[1];
            showView(view);
        });
    });

    // User menu
    const userMenuBtn = document.querySelector('.user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }

    // Search
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Modal close buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Form submissions
    setupFormHandlers();

    // Drag and drop
    setupDragAndDrop();

    console.log('✅ Event listeners initialized');
}

// Form Handlers
function setupFormHandlers() {
    // Create Task Form
    const createTaskForm = document.getElementById('createTaskForm');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', handleCreateTask);
    }

    // Create Team Form
    const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', handleCreateTeam);
    }
}

// View Management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const viewElement = document.getElementById(viewName + 'View');
    if (viewElement) {
        viewElement.classList.add('active');
    }

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showView('${viewName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Load view-specific data
    switch(viewName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'board':
            loadKanbanBoard();
            break;
        case 'teams':
            loadTeamsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }

    // Update page title
    updatePageTitle(viewName);
}

function updatePageTitle(viewName) {
    const titles = {
        dashboard: 'Dashboard - TaskFlow',
        board: 'Board - TaskFlow',
        teams: 'Teams - TaskFlow',
        analytics: 'Analytics - TaskFlow'
    };
    document.title = titles[viewName] || 'TaskFlow';
}

// Dashboard Data Loading
async function loadDashboardData() {
    try {
        // Update stats
        updateDashboardStats();

        // Load tasks
        loadDashboardTasks();

        // Load activity
        loadDashboardActivity();

        // Load teams
        loadDashboardTeams();

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function updateDashboardStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const activeTeams = teams.length;
    const activeProjects = 5; // Mock data

    if (elements.totalTasks) elements.totalTasks.textContent = totalTasks;
    if (elements.completedTasks) elements.completedTasks.textContent = completedTasks;
    if (elements.activeTeams) elements.activeTeams.textContent = activeTeams;
    if (elements.activeProjects) elements.activeProjects.textContent = activeProjects;
}

function loadDashboardTasks() {
    const userTasks = tasks.filter(task => task.assignee.id === currentUser.id).slice(0, 6);

    if (elements.myTasks) {
        elements.myTasks.innerHTML = userTasks.map(task => createTaskCard(task)).join('');
    }
}

function loadDashboardActivity() {
    const recentActivities = activities.slice(0, 10);

    if (elements.recentActivity) {
        elements.recentActivity.innerHTML = recentActivities.map(activity => createActivityItem(activity)).join('');
    }
}

function loadDashboardTeams() {
    if (elements.myTeams) {
        elements.myTeams.innerHTML = teams.map(team => createTeamCard(team)).join('');
    }
}

// Component Creation Functions
function createTaskCard(task) {
    const priorityClass = `task-priority ${task.priority}`;
    const dueDate = new Date(task.dueDate).toLocaleDateString();
    const isOverdue = new Date(task.dueDate) < new Date();

    return `
        <div class="task-card" onclick="viewTask(${task.id})">
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="${priorityClass}">${task.priority}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-assignee">
                    <span>${task.assignee.avatar}</span>
                    <span>${task.assignee.name}</span>
                </div>
                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">Due: ${dueDate}</span>
            </div>
        </div>
    `;
}

function createActivityItem(activity) {
    const timeAgo = getTimeAgo(new Date(activity.timestamp));

    return `
        <div class="activity-item">
            <div class="activity-icon">${activity.user.avatar}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.message}</div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        </div>
    `;
}

function createTeamCard(team) {
    return `
        <div class="team-card" onclick="viewTeam(${team.id})">
            <div class="team-header">
                <div class="team-avatar">${team.avatar}</div>
                <div class="team-info">
                    <h3>${team.name}</h3>
                    <p>${team.description}</p>
                </div>
            </div>
            <div class="team-stats">
                <div class="team-stat">
                    <span>👥</span>
                    <span>${team.memberCount} members</span>
                </div>
                <div class="team-stat">
                    <span>📋</span>
                    <span>${team.projectCount} projects</span>
                </div>
            </div>
        </div>
    `;
}

// Kanban Board Management
function loadKanbanBoard() {
    try {
        // Update project info
        if (elements.boardTitle) {
            elements.boardTitle.textContent = currentProject.name;
        }
        if (elements.boardDescription) {
            elements.boardDescription.textContent = currentProject.description;
        }

        // Load team members
        loadProjectMembers();

        // Load tasks in columns
        loadKanbanTasks();

        // Update task counts
        updateTaskCounts();

    } catch (error) {
        console.error('Failed to load kanban board:', error);
        showNotification('Failed to load project board', 'error');
    }
}

function loadProjectMembers() {
    if (elements.projectMembers) {
        elements.projectMembers.innerHTML = currentProject.members.map(member => `
            <div class="member-item">
                <span class="member-avatar">${member.avatar}</span>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.role}</div>
                </div>
            </div>
        `).join('');
    }
}

function loadKanbanTasks() {
    const columns = ['todo', 'in-progress', 'review', 'done'];

    columns.forEach(status => {
        const columnElement = document.getElementById(`${status.replace('-', '')}Column`);
        const columnTasks = tasks.filter(task => task.status === status);

        if (columnElement) {
            const tasksHtml = columnTasks.map(task => createKanbanTask(task)).join('');
            const addButton = status !== 'done' ? `<button onclick="showCreateTask('${status}')" class="add-task-btn">+ Add Task</button>` : '';

            columnElement.innerHTML = tasksHtml + addButton;
        }
    });
}

function createKanbanTask(task) {
    const priorityClass = `priority-${task.priority}`;
    const dueDate = new Date(task.dueDate).toLocaleDateString();
    const isOverdue = new Date(task.dueDate) < new Date();

    return `
        <div class="kanban-task" data-task-id="${task.id}" draggable="true" onclick="viewTask(${task.id})">
            <div class="task-header">
                <h4>${task.title}</h4>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
            </div>
            <div class="task-meta">
                <div class="task-assignee">
                    <span>${task.assignee.avatar}</span>
                    <span>${task.assignee.name}</span>
                </div>
                <div class="task-due ${isOverdue ? 'overdue' : ''}">
                    <span>📅</span>
                    <span>${dueDate}</span>
                </div>
            </div>
            ${task.labels.length > 0 ? `<div class="task-labels">${task.labels.map(label => `<span class="label">${label}</span>`).join('')}</div>` : ''}
        </div>
    `;
}

function updateTaskCounts() {
    const counts = {
        todo: tasks.filter(t => t.status === 'todo').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        done: tasks.filter(t => t.status === 'done').length
    };

    if (elements.todoCount) elements.todoCount.textContent = counts.todo;
    if (elements.inProgressCount) elements.inProgressCount.textContent = counts['in-progress'];
    if (elements.reviewCount) elements.reviewCount.textContent = counts.review;
    if (elements.doneCount) elements.doneCount.textContent = counts.done;
}

// Teams Management
function loadTeamsData() {
    if (elements.teamsList) {
        elements.teamsList.innerHTML = teams.map(team => `
            <div class="team-card" onclick="viewTeam(${team.id})">
                <div class="team-header">
                    <div class="team-avatar">${team.avatar}</div>
                    <div class="team-info">
                        <h3>${team.name}</h3>
                        <p>${team.description}</p>
                    </div>
                </div>
                <div class="team-stats">
                    <div class="team-stat">
                        <span>👥</span>
                        <span>${team.memberCount} members</span>
                    </div>
                    <div class="team-stat">
                        <span>📋</span>
                        <span>${team.projectCount} projects</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Analytics Management
function loadAnalyticsData() {
    // Analytics data would be loaded here
    // For now, it's using static data in the HTML
    console.log('Analytics data loaded');
}

// Form Handlers
async function handleCreateTask(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        status: formData.get('status') || 'todo',
        assignee: formData.get('assignedTo') || currentUser.id,
        dueDate: formData.get('dueDate'),
        labels: formData.get('labels') ? formData.get('labels').split(',').map(l => l.trim()) : []
    };

    try {
        // Create new task
        const newTask = {
            id: Date.now(),
            ...taskData,
            assignee: currentUser, // Simplified
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasks.push(newTask);

        // Add activity
        addActivity('task_created', `${currentUser.firstName} created task "${newTask.title}"`);

        // Close modal and refresh
        closeModal('createTaskModal');
        showNotification('Task created successfully!', 'success');
        e.target.reset();

        // Refresh current view
        const activeView = document.querySelector('.view.active');
        if (activeView.id === 'dashboardView') {
            loadDashboardData();
        } else if (activeView.id === 'boardView') {
            loadKanbanBoard();
        }

    } catch (error) {
        console.error('Failed to create task:', error);
        showNotification('Failed to create task', 'error');
    }
}

async function handleCreateTeam(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const teamData = {
        name: formData.get('name'),
        description: formData.get('description'),
        members: formData.get('members') ? formData.get('members').split(',').map(email => email.trim()) : []
    };

    try {
        // Create new team
        const newTeam = {
            id: Date.now(),
            ...teamData,
            memberCount: teamData.members.length + 1,
            projectCount: 0,
            avatar: '🚀',
            members: [{ id: currentUser.id, name: currentUser.firstName + ' ' + currentUser.lastName, role: 'Team Lead' }]
        };

        teams.push(newTeam);

        // Add activity
        addActivity('team_created', `${currentUser.firstName} created team "${newTeam.name}"`);

        // Close modal and refresh
        closeModal('createTeamModal');
        showNotification('Team created successfully!', 'success');
        e.target.reset();

        // Refresh teams view
        loadTeamsData();

    } catch (error) {
        console.error('Failed to create team:', error);
        showNotification('Failed to create team', 'error');
    }
}

// Modal Management
function showCreateTask(defaultStatus = 'todo') {
    // Set default status
    const statusSelect = document.getElementById('taskStatus');
    if (statusSelect) {
        statusSelect.value = defaultStatus;
    }

    showModal('createTaskModal');
}

function showCreateTeam() {
    showModal('createTeamModal');
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

function viewTask(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;

    const modal = document.getElementById('taskDetailsModal');
    const content = document.getElementById('taskDetailsContent');

    if (modal && content) {
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        const createdDate = new Date(task.createdAt).toLocaleDateString();

        content.innerHTML = `
            <div class="task-detail-content">
                <div class="task-detail-header">
                    <h2>${task.title}</h2>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>

                <div class="task-detail-meta">
                    <div class="meta-item">
                        <span class="meta-icon">👤</span>
                        <span>Assigned to: ${task.assignee.name}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">📅</span>
                        <span>Due: ${dueDate}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">📝</span>
                        <span>Status: ${task.status}</span>
                    </div>
                </div>

                <div class="task-detail-description">
                    <h3>Description</h3>
                    <p>${task.description}</p>
                </div>

                ${task.labels.length > 0 ? `
                    <div class="task-detail-labels">
                        <h3>Labels</h3>
                        <div class="labels-list">
                            ${task.labels.map(label => `<span class="label">${label}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="task-detail-actions">
                    <button onclick="editTask(${task.id})" class="btn-secondary">Edit Task</button>
                    <button onclick="deleteTask(${task.id})" class="btn-secondary">Delete Task</button>
                    <button onclick="closeModal('taskDetailsModal')" class="btn-primary">Close</button>
                </div>
            </div>
        `;

        showModal('taskDetailsModal');
    }
}

function viewTeam(teamId) {
    const team = teams.find(t => t.id == teamId);
    if (!team) return;

    showNotification(`Viewing team: ${team.name}`, 'info');
    // In a real app, this would navigate to team details
}

// Drag and Drop Functionality
function setupDragAndDrop() {
    let draggedTask = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('kanban-task')) {
            draggedTask = e.target;
            e.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('kanban-task')) {
            e.target.classList.remove('dragging');
            draggedTask = null;
        }
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('column-content')) {
            e.target.classList.add('drag-over');
        }
    });

    document.addEventListener('dragleave', (e) => {
        if (e.target.classList.contains('column-content')) {
            e.target.classList.remove('drag-over');
        }
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();

        if (e.target.classList.contains('column-content') && draggedTask) {
            const newStatus = e.target.closest('.kanban-column').dataset.status;
            const taskId = parseInt(draggedTask.dataset.taskId);

            // Move task to new column
            e.target.appendChild(draggedTask);

            // Update task status
            updateTaskStatus(taskId, newStatus);

            // Remove drag-over class
            e.target.classList.remove('drag-over');

            // Show success notification
            showNotification(`Task moved to ${newStatus.replace('-', ' ').toUpperCase()}`, 'success');
        }
    });
}

function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id == taskId);
    if (task) {
        const oldStatus = task.status;
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();

        // Add activity
        addActivity('task_moved', `${currentUser.firstName} moved task "${task.title}" from ${oldStatus} to ${newStatus}`);

        // Update UI
        updateTaskCounts();
    }
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        // Reset search results
        loadDashboardTasks();
        return;
    }

    // Filter tasks
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.name.toLowerCase().includes(query) ||
        task.labels.some(label => label.toLowerCase().includes(query))
    );

    // Update UI
    if (elements.myTasks) {
        elements.myTasks.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
    }
}

// User Menu
function toggleUserMenu() {
    const dropdown = elements.userDropdown;
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Activity Management
function addActivity(type, message) {
    const newActivity = {
        id: Date.now(),
        type: type,
        message: message,
        timestamp: new Date().toISOString(),
        user: {
            name: currentUser.firstName + ' ' + currentUser.lastName,
            avatar: currentUser.avatar
        }
    };

    activities.unshift(newActivity);

    // Keep only recent activities
    if (activities.length > 50) {
        activities = activities.slice(0, 50);
    }

    // Refresh activity feed if visible
    if (elements.recentActivity) {
        loadDashboardActivity();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);

    if (!elements.notifications) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${getNotificationIcon(type)}</div>
        <div class="notification-message">${message}</div>
        <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
    `;

    elements.notifications.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// Real-time Updates Simulation
function setupRealtimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Simulate random task updates
        if (Math.random() < 0.1) { // 10% chance
            simulateTaskUpdate();
        }
    }, 30000);
}

function simulateTaskUpdate() {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    if (!randomTask) return;

    const actions = ['updated', 'commented on', 'assigned'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    addActivity('task_updated', `Sarah ${action} task "${randomTask.title}"`);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function initializeUI() {
    // Update user info
    if (elements.userAvatar) {
        elements.userAvatar.textContent = currentUser.avatar;
    }
    if (elements.userName) {
        elements.userName.textContent = currentUser.firstName;
    }

    // Show dashboard by default
    showView('dashboard');
}

// Task Management Functions
function editTask(taskId) {
    // In a real app, this would open an edit modal
    showNotification('Edit functionality would open here', 'info');
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex > -1) {
        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1);

        // Add activity
        addActivity('task_deleted', `${currentUser.firstName} deleted task "${task.title}"`);

        // Close modal and refresh
        closeModal('taskDetailsModal');
        showNotification('Task deleted successfully', 'success');

        // Refresh current view
        const activeView = document.querySelector('.view.active');
        if (activeView.id === 'dashboardView') {
            loadDashboardData();
        } else if (activeView.id === 'boardView') {
            loadKanbanBoard();
        }
    }
}

// Team Management Functions
function viewTeam(teamId) {
    const team = teams.find(t => t.id == teamId);
    if (!team) return;

    showNotification(`Viewing team: ${team.name}`, 'info');
    // In a real app, this would navigate to team details page
}

// Export functions for global access
window.showView = showView;
window.showCreateTask = showCreateTask;
window.showCreateTeam = showCreateTeam;
window.showModal = showModal;
window.closeModal = closeModal;
window.toggleUserMenu = toggleUserMenu;
window.handleSearch = handleSearch;
window.performSearch = () => handleSearch({ target: { value: elements.searchInput.value } });
window.viewTask = viewTask;
window.viewTeam = viewTeam;
window.refreshDashboard = () => loadDashboardData();
window.showProjectSettings = () => showNotification('Project settings would open here', 'info');
window.showAllTasks = () => showView('board');
window.showAllActivity = () => showNotification('Full activity feed would open here', 'info');
window.showProfile = () => showNotification('Profile page would open here', 'info');
window.showSettings = () => showNotification('Settings page would open here', 'info');
window.showNotifications = () => showNotification('Notifications panel would open here', 'info');
window.logout = () => {
    showNotification('Logged out successfully', 'success');
    // In a real app, this would redirect to login
};
window.showLogin = () => showNotification('Login modal would open here', 'info');
window.showRegister = () => showNotification('Register modal would open here', 'info');
window.showOrders = () => showNotification('Orders page would open here', 'info');
window.showWishlist = () => showNotification('Wishlist page would open here', 'info');
window.showContact = () => showNotification('Contact page would open here', 'info');
window.showAbout = () => showNotification('About page would open here', 'info');
window.showDeals = () => showNotification('Deals page would open here', 'info');
window.showCategories = () => showNotification('Categories page would open here', 'info');
window.showProducts = () => showNotification('Products page would open here', 'info');
window.showHome = () => showView('dashboard');
window.toggleCart = () => showNotification('Cart functionality would open here', 'info');
window.checkout = () => showNotification('Checkout process would start here', 'info');
window.performGlobalSearch = () => performSearch();
window.updateAnalytics = () => showNotification('Analytics updated', 'success');
window.toggleMobileMenu = () => showNotification('Mobile menu would toggle here', 'info');
window.closeNotifications = () => showNotification('Notifications panel closed', 'info');
window.showForgotPassword = () => showNotification('Forgot password modal would open here', 'info');
window.showTerms = () => showNotification('Terms of service would open here', 'info');
window.switchToRegister = () => showModal('registerModal');
window.switchToLogin = () => showModal('loginModal');
window.togglePassword = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.type = field.type === 'password' ? 'text' : 'password';
    }
};
window.decreaseQuantity = () => {
    const qty = document.getElementById('productQuantity');
    if (qty && qty.value > 1) qty.value = parseInt(qty.value) - 1;
};
window.increaseQuantity = () => {
    const qty = document.getElementById('productQuantity');
    if (qty) qty.value = parseInt(qty.value) + 1;
};
window.addToCart = () => showNotification('Item added to cart!', 'success');
window.buyNow = () => showNotification('Buy now process would start here', 'info');
window.showCategory = (category) => showNotification(`Showing ${category} category`, 'info');
window.clearFilters = () => showNotification('Filters cleared', 'success');
window.applyFilters = () => showNotification('Filters applied', 'success');
window.applySorting = () => showNotification('Sorting applied', 'success');
window.updatePriceRange = () => showNotification('Price range updated', 'info');
window.setViewMode = (mode) => showNotification(`Switched to ${mode} view`, 'info');
window.previousStep = () => showNotification('Previous step', 'info');
window.placeOrder = () => showNotification('Order placed successfully!', 'success');
window.proceedToCheckout = () => showView('checkout');
window.showCart = () => showView('cart');
window.printOrder = () => showNotification('Printing order receipt...', 'info');
window.refreshDashboard = () => loadDashboardData();
