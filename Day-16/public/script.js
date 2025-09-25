/* ===================================================
   Day 16: Combined APIs - Interactive Functionality
   ===================================================
   Complete JavaScript Implementation for Multi-Resource API Demo */

// Global state management
class AppState {
    constructor() {
        this.currentSection = 'overview';
        this.testResults = {};
        this.analyticsData = null;
        this.syncStatus = {};
        this.apiBaseUrl = 'http://localhost:5000/api';
    }

    // Section navigation
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // Update navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        const activeTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    // Load data for specific sections
    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'analytics':
                await this.loadAnalyticsData();
                break;
            case 'sync':
                await this.loadSyncData();
                break;
            default:
                break;
        }
    }

    // Analytics data loading
    async loadAnalyticsData() {
        try {
            const period = document.getElementById('analytics-period').value;
            const userId = '64f1a2b3c4d5e6f7g8h9i0j1'; // Mock user ID

            // Simulate API call with mock data
            const mockData = this.generateMockAnalyticsData(period);

            this.updateAnalyticsDisplay(mockData);
            this.analyticsData = mockData;

            // Generate AI insights
            this.generateInsights(mockData);

        } catch (error) {
            console.error('Failed to load analytics data:', error);
            this.showNotification('Failed to load analytics data', 'error');
        }
    }

    // Generate mock analytics data
    generateMockAnalyticsData(period) {
        const multipliers = {
            'all': 1,
            'year': 0.8,
            '6months': 0.6,
            '3months': 0.4,
            'month': 0.2
        };

        const multiplier = multipliers[period] || 1;

        return {
            technologyCount: Math.round(25 * multiplier),
            projectCount: Math.round(15 * multiplier),
            skillAverage: (4.2 * multiplier).toFixed(1),
            experienceMonths: Math.round(36 * multiplier),
            technologies: [
                { name: 'React', usage: Math.round(15 * multiplier), projects: Math.round(8 * multiplier) },
                { name: 'Node.js', usage: Math.round(12 * multiplier), projects: Math.round(6 * multiplier) },
                { name: 'MongoDB', usage: Math.round(10 * multiplier), projects: Math.round(5 * multiplier) },
                { name: 'JavaScript', usage: Math.round(18 * multiplier), projects: Math.round(12 * multiplier) },
                { name: 'Python', usage: Math.round(8 * multiplier), projects: Math.round(3 * multiplier) }
            ],
            projects: {
                total: Math.round(15 * multiplier),
                completed: Math.round(12 * multiplier),
                inProgress: Math.round(2 * multiplier),
                planned: Math.round(1 * multiplier)
            },
            skills: {
                total: Math.round(20 * multiplier),
                average: (4.2 * multiplier).toFixed(1),
                distribution: {
                    beginner: Math.round(2 * multiplier),
                    intermediate: Math.round(8 * multiplier),
                    advanced: Math.round(7 * multiplier),
                    expert: Math.round(3 * multiplier)
                }
            }
        };
    }

    // Update analytics display
    updateAnalyticsDisplay(data) {
        // Update metrics
        document.getElementById('tech-count').textContent = data.technologyCount;
        document.getElementById('project-count').textContent = data.projectCount;
        document.getElementById('skill-avg').textContent = data.skillAverage;
        document.getElementById('exp-months').textContent = data.experienceMonths;

        // Update charts (simplified placeholders for now)
        this.updateChartPlaceholders(data);
    }

    // Update chart placeholders
    updateChartPlaceholders(data) {
        const charts = [
            { id: 'tech-chart', icon: '📊', text: `${data.technologyCount} technologies analyzed` },
            { id: 'project-chart', icon: '🚀', text: `${data.projects.completed} completed, ${data.projects.inProgress} in progress` },
            { id: 'skill-chart', icon: '🛠️', text: `Average proficiency: ${data.skillAverage}/5` },
            { id: 'timeline-chart', icon: '💼', text: `${data.experienceMonths} months of experience` }
        ];

        charts.forEach(chart => {
            const element = document.getElementById(chart.id);
            if (element) {
                element.innerHTML = `
                    <div class="chart-icon">${chart.icon}</div>
                    <p>${chart.text}</p>
                `;
            }
        });
    }

    // Generate AI insights
    generateInsights(data) {
        const insights = [
            {
                icon: '🚀',
                text: `You have ${data.technologyCount} technologies in your stack. Consider specializing in ${data.technologies[0]?.name || 'a key technology'} for deeper expertise.`
            },
            {
                icon: '📈',
                text: `Your average skill proficiency of ${data.skillAverage}/5 is excellent! Focus on maintaining this high standard.`
            },
            {
                icon: '💼',
                text: `With ${data.experienceMonths} months of experience, you're well-positioned for senior-level opportunities.`
            },
            {
                icon: '🎯',
                text: `${data.projects.completed} completed projects showcase your ability to deliver. Consider starting a new project in ${data.technologies[1]?.name || 'an emerging technology'}.`
            }
        ];

        const insightsList = document.getElementById('insights-list');
        if (insightsList) {
            insightsList.innerHTML = insights.map(insight => `
                <div class="insight-item">
                    <div class="insight-icon">${insight.icon}</div>
                    <div class="insight-content">
                        <p>${insight.text}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load sync data
    async loadSyncData() {
        // Mock sync status data
        this.syncStatus = {
            workExperience: { count: 5, lastSync: new Date().toISOString() },
            projects: { count: 12, lastSync: new Date().toISOString() },
            skills: { count: 18, lastSync: new Date().toISOString() },
            orphanedRecords: 0
        };

        this.updateSyncDisplay();
    }

    // Update sync display
    updateSyncDisplay() {
        const metrics = [
            { id: 'work-exp-count', value: this.syncStatus.workExperience.count },
            { id: 'sync-project-count', value: this.syncStatus.projects.count },
            { id: 'sync-skill-count', value: this.syncStatus.skills.count },
            { id: 'sync-orphaned-count', value: this.syncStatus.orphanedRecords }
        ];

        metrics.forEach(metric => {
            const element = document.getElementById(metric.id);
            if (element) {
                element.textContent = metric.value;
                if (metric.id === 'orphaned-count' && metric.value > 0) {
                    element.classList.add('error');
                }
            }
        });
    }

    // API Testing functionality
    async testEndpoint() {
        const endpoint = document.getElementById('test-endpoint').value;
        const responseDisplay = document.getElementById('test-response');
        const testBtn = document.getElementById('test-btn');

        try {
            testBtn.classList.add('loading');
            testBtn.disabled = true;
            testBtn.textContent = 'Testing...';

            // Simulate API call with mock data
            const mockResponse = await this.simulateApiCall(endpoint);

            // Display response
            responseDisplay.innerHTML = `<pre>${JSON.stringify(mockResponse, null, 2)}</pre>`;

            // Update test status
            this.updateTestStatus(endpoint.split('/')[0], 'success');

            this.showNotification('API test completed successfully!', 'success');

        } catch (error) {
            responseDisplay.innerHTML = `<pre style="color: #ef4444;">Error: ${error.message}</pre>`;
            this.updateTestStatus(endpoint.split('/')[0], 'error');
            this.showNotification('API test failed', 'error');
        } finally {
            testBtn.classList.remove('loading');
            testBtn.disabled = false;
            testBtn.textContent = 'Test Endpoint';
        }
    }

    // Simulate API call with mock data
    async simulateApiCall(endpoint) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const endpointType = endpoint.split('/')[0];

        switch (endpointType) {
            case 'profile':
                if (endpoint.includes('complete')) {
                    return {
                        success: true,
                        data: {
                            user: {
                                name: "John Doe",
                                email: "john@example.com",
                                profileCompleteness: 85
                            },
                            workExperience: [
                                {
                                    company: "Tech Corp",
                                    position: "Senior Developer",
                                    startDate: "2023-01-15",
                                    current: true
                                }
                            ],
                            projects: [
                                {
                                    title: "E-commerce Platform",
                                    technologies: ["React", "Node.js", "MongoDB"],
                                    status: "completed"
                                }
                            ],
                            skills: [
                                { name: "React", proficiency: 5 },
                                { name: "Node.js", proficiency: 4 }
                            ],
                            analytics: {
                                totalExperience: 24,
                                technologyStats: [
                                    { technology: "React", totalUsage: 5 },
                                    { technology: "Node.js", totalUsage: 4 }
                                ],
                                skillProficiency: { average: 4.2, totalSkills: 15 }
                            }
                        }
                    };
                }
                break;

            case 'search':
                return {
                    success: true,
                    data: {
                        projects: [
                            {
                                title: "React Dashboard",
                                description: "Modern dashboard built with React",
                                technologies: ["React", "JavaScript", "CSS"]
                            }
                        ],
                        workExperience: [
                            {
                                company: "Tech Corp",
                                position: "Frontend Developer",
                                technologies: ["React", "JavaScript"]
                            }
                        ],
                        skills: [
                            { name: "React", proficiency: 5, category: "frontend" }
                        ]
                    },
                    meta: {
                        query: "react",
                        totalResults: 3,
                        searchTypes: ["projects", "experience", "skills"]
                    }
                };

            case 'analytics':
                return {
                    success: true,
                    data: {
                        technologyCount: 8,
                        mostUsed: { name: "React", usage: 5 },
                        averageSkillLevel: 4.2,
                        trendingTechnologies: ["React", "TypeScript", "Node.js"]
                    },
                    summary: {
                        totalTechnologies: 8,
                        categoryDistribution: {
                            frontend: 3,
                            backend: 3,
                            database: 2
                        }
                    }
                };

            default:
                throw new Error(`Unknown endpoint: ${endpoint}`);
        }
    }

    // Update test status
    updateTestStatus(testType, status) {
        const statusElements = {
            'profile': 'profile-test-status',
            'search': 'search-test-status',
            'analytics': 'analytics-test-status'
        };

        const element = document.getElementById(statusElements[testType]);
        if (element) {
            element.textContent = status === 'success' ? 'Passed' : 'Failed';
            element.style.color = status === 'success' ? '#10b981' : '#ef4444';
        }
    }

    // Sync operations
    async performSync(operation) {
        const output = document.getElementById('sync-output');
        // Buttons have explicit IDs in the markup
        const buttonIds = {
            'skills': 'sync-skills-btn',
            'projects': 'sync-projects-btn',
            'validate': 'validate-data-btn'
        };
        const button = document.getElementById(buttonIds[operation]);

        try {
            button.classList.add('loading');
            button.disabled = true;

            // Simulate sync operation
            const result = await this.simulateSyncOperation(operation);

            output.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            this.showNotification(`${operation} sync completed!`, 'success');

        } catch (error) {
            output.innerHTML = `<pre style="color: #ef4444;">Error: ${error.message}</pre>`;
            this.showNotification(`${operation} sync failed`, 'error');
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Simulate sync operations
    async simulateSyncOperation(operation) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        switch (operation) {
            case 'skills':
                return {
                    success: true,
                    synced: 3,
                    total: 15,
                    results: [
                        { skill: "React", oldValue: 3, newValue: 4, updated: true },
                        { skill: "Node.js", oldValue: 4, newValue: 4, updated: false },
                        { skill: "MongoDB", oldValue: 3, newValue: 4, updated: true }
                    ],
                    message: "Skill proficiency updated based on project usage"
                };

            case 'projects':
                return {
                    success: true,
                    created: 2,
                    technologies: ["Next.js", "GraphQL"],
                    message: "Discovered 2 new technologies from project descriptions"
                };

            case 'validate':
                return {
                    success: true,
                    issues: [],
                    stats: {
                        workExperience: 5,
                        projects: 12,
                        skills: 15,
                        orphanedRecords: 0
                    },
                    message: "Data consistency validated successfully"
                };

            default:
                throw new Error(`Unknown sync operation: ${operation}`);
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        const container = document.querySelector('.notifications-container') || document.body;
        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDuration(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0) {
            return `${years}y ${remainingMonths}m`;
        }
        return `${remainingMonths}m`;
    }

    debounce(func, wait) {
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
}

// Initialize the application
const app = new AppState();

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    app.showSection(sectionId);
}

function performSync(operation) {
    app.performSync(operation);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with overview section
    app.showSection('overview');

    // Set up test button
    const testBtn = document.getElementById('test-btn');
    if (testBtn) {
        testBtn.addEventListener('click', () => app.testEndpoint());
    }

    // Set up analytics refresh
    const refreshBtn = document.getElementById('refresh-analytics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => app.loadAnalyticsData());
    }

    // Set up sync buttons
    const syncButtons = [
        { id: 'sync-skills-btn', operation: 'skills' },
        { id: 'sync-projects-btn', operation: 'projects' },
        { id: 'validate-data-btn', operation: 'validate' }
    ];

    syncButtons.forEach(({ id, operation }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => app.performSync(operation));
        }
    });

    // Set up analytics period change
    const periodSelect = document.getElementById('analytics-period');
    if (periodSelect) {
        periodSelect.addEventListener('change', () => app.loadAnalyticsData());
    }

    // Show welcome notification
    setTimeout(() => {
        app.showNotification('Welcome to Day 16: Combined APIs Demo! 🎉', 'success');
    }, 1000);
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Alt + number shortcuts for sections
    if (event.altKey) {
        const sections = ['overview', 'endpoints', 'testing', 'analytics', 'sync'];
        const number = parseInt(event.key) - 1;
        if (number >= 0 && number < sections.length) {
            event.preventDefault();
            app.showSection(sections[number]);
        }
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    app.showNotification('An error occurred. Please refresh the page.', 'error');
});

// Service worker registration for PWA capabilities (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here for offline capabilities
        console.log('Service Worker support detected');
    });
}

// Performance monitoring (for demonstration)
const perfData = {
    pageLoad: performance.now(),
    interactions: 0
};

document.addEventListener('click', () => {
    perfData.interactions++;
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, app };
}
