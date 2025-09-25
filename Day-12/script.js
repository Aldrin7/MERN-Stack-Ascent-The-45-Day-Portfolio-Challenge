// Day 12: Rest & Review - Complete REST API Mastery
// Interactive Review and Progress Tracking

// Global state management
let progressState = {
    checkpoints: {
        mongodb: { completed: 0, total: 5, skills: {} },
        express: { completed: 0, total: 5, skills: {} },
        rest: { completed: 0, total: 5, skills: {} },
        crud: { completed: 0, total: 5, skills: {} }
    },
    exercises: {
        1: { status: 'not-started', name: 'Blog API' },
        2: { status: 'not-started', name: 'Task Manager API' },
        3: { status: 'not-started', name: 'User Management API' },
        4: { status: 'not-started', name: 'Product Inventory API' },
        5: { status: 'not-started', name: 'Library Management API' }
    },
    achievements: {
        'first-exercise': false,
        'half-way': false,
        'all-exercises': false,
        'master': false
    },
    lastUpdated: null
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Day 12: Rest & Review Interface Loaded');

    // Load saved progress
    loadProgress();

    // Initialize all components
    initializeCheckpoints();
    initializeExercises();
    initializeTabs();
    initializeAchievements();

    // Update all displays
    updateProgressDisplay();

    // Show welcome message
    showWelcomeMessage();
});

// Initialize checkpoint functionality
function initializeCheckpoints() {
    const checkboxes = document.querySelectorAll('.checkpoint-items input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        const skillId = checkbox.getAttribute('data-skill');
        const topic = checkbox.closest('.checkpoint-card').getAttribute('data-topic');

        // Load saved state
        if (progressState.checkpoints[topic].skills[skillId]) {
            checkbox.checked = true;
        }

        // Add event listener
        checkbox.addEventListener('change', function() {
            updateCheckpoint(topic, skillId, this.checked);
        });
    });

    console.log('✅ Checkpoints initialized');
}

// Initialize exercise functionality
function initializeExercises() {
    // Exercises are handled by individual functions
    console.log('✅ Exercise system initialized');
}

// Initialize tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    console.log('✅ Tabs initialized');
}

// Initialize achievements
function initializeAchievements() {
    // Achievements are unlocked based on progress
    updateAchievements();
    console.log('✅ Achievements initialized');
}

// Checkpoint Management
function updateCheckpoint(topic, skillId, isChecked) {
    // Update state
    progressState.checkpoints[topic].skills[skillId] = isChecked;

    // Recalculate completed count
    const skills = progressState.checkpoints[topic].skills;
    const completed = Object.values(skills).filter(Boolean).length;
    progressState.checkpoints[topic].completed = completed;

    // Update timestamp
    progressState.lastUpdated = new Date().toISOString();

    // Save progress
    saveProgress();

    // Update display
    updateProgressDisplay();

    // Check for achievements
    updateAchievements();

    console.log(`📝 Checkpoint updated: ${topic}.${skillId} = ${isChecked}`);
}

// Progress Display Updates
function updateProgressDisplay() {
    // Update header progress bar
    updateHeaderProgress();

    // Update progress circles
    updateProgressCircles();

    // Update progress text
    updateProgressText();

    // Update visual feedback
    updateVisualFeedback();
}

function updateHeaderProgress() {
    const totalSkills = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.total, 0);
    const completedSkills = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.completed, 0);

    const percentage = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${completedSkills} / ${totalSkills} Skills Mastered`;
    }
}

function updateProgressCircles() {
    // Assessment Progress (Self-assessment)
    const assessmentCompleted = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.completed, 0);
    const assessmentTotal = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.total, 0);
    const assessmentPercentage = assessmentTotal > 0 ? (assessmentCompleted / assessmentTotal) * 100 : 0;

    updateProgressCircle('assessmentProgress', 'assessmentText', assessmentPercentage, 'Assessment');

    // Exercise Progress
    const exercisesCompleted = Object.values(progressState.exercises)
        .filter(exercise => exercise.status === 'completed').length;
    const exercisesTotal = Object.keys(progressState.exercises).length;
    const exercisePercentage = exercisesTotal > 0 ? (exercisesCompleted / exercisesTotal) * 100 : 0;

    updateProgressCircle('exerciseProgress', 'exerciseText', exercisePercentage, 'Exercises');

    // Mastery Progress (Combined)
    const combinedCompleted = assessmentCompleted + exercisesCompleted;
    const combinedTotal = assessmentTotal + exercisesTotal;
    const masteryPercentage = combinedTotal > 0 ? (combinedCompleted / combinedTotal) * 100 : 0;

    updateProgressCircle('masteryProgress', 'masteryText', masteryPercentage, 'Mastery');
}

function updateProgressCircle(circleId, textId, percentage, label) {
    const circle = document.getElementById(circleId);
    const text = document.getElementById(textId);

    if (circle) {
        // Update CSS custom property for conic gradient
        circle.style.background = `conic-gradient(#6f42c1 0deg, #6f42c1 ${percentage * 3.6}deg, #e9ecef ${percentage * 3.6}deg, #e9ecef 360deg)`;

        // Add animation class
        circle.classList.add('updated');
        setTimeout(() => circle.classList.remove('updated'), 500);
    }

    if (text) {
        text.textContent = `${Math.round(percentage)}%`;
    }

    console.log(`📊 ${label} Progress: ${Math.round(percentage)}%`);
}

function updateProgressText() {
    const exercisesCompleted = Object.values(progressState.exercises)
        .filter(exercise => exercise.status === 'completed').length;
    const exercisesTotal = Object.keys(progressState.exercises).length;

    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${exercisesCompleted} / ${exercisesTotal} Exercises Completed`;
    }
}

function updateVisualFeedback() {
    // Add visual feedback for completed sections
    const checkpointCards = document.querySelectorAll('.checkpoint-card');

    checkpointCards.forEach(card => {
        const topic = card.getAttribute('data-topic');
        const completed = progressState.checkpoints[topic].completed;
        const total = progressState.checkpoints[topic].total;

        if (completed === total && total > 0) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });
}

// Exercise Management
function startExercise(exerciseNumber) {
    const exercise = progressState.exercises[exerciseNumber];

    if (exercise.status === 'not-started') {
        exercise.status = 'in-progress';
        updateExerciseDisplay(exerciseNumber);
        saveProgress();

        showNotification(`Started Exercise ${exerciseNumber}: ${exercise.name}`, 'info');
        console.log(`🚀 Started Exercise ${exerciseNumber}: ${exercise.name}`);
    }
}

function completeExercise(exerciseNumber) {
    const exercise = progressState.exercises[exerciseNumber];

    if (exercise.status === 'in-progress' || exercise.status === 'not-started') {
        exercise.status = 'completed';
        updateExerciseDisplay(exerciseNumber);
        saveProgress();
        updateProgressDisplay();
        updateAchievements();

        showNotification(`Completed Exercise ${exerciseNumber}: ${exercise.name}!`, 'success');
        console.log(`✅ Completed Exercise ${exerciseNumber}: ${exercise.name}`);
    }
}

function updateExerciseDisplay(exerciseNumber) {
    const exerciseCard = document.getElementById(`exercise${exerciseNumber}`);
    const statusElement = document.getElementById(`exercise${exerciseNumber}-status`);

    if (exerciseCard && statusElement) {
        const status = progressState.exercises[exerciseNumber].status;

        // Update status element
        statusElement.textContent = formatStatus(status);
        statusElement.className = `exercise-status ${status}`;

        // Update card styling
        exerciseCard.className = `exercise-card ${status}`;
    }
}

function formatStatus(status) {
    switch (status) {
        case 'not-started': return 'Not Started';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        default: return 'Unknown';
    }
}

// Achievement System
function updateAchievements() {
    const exercisesCompleted = Object.values(progressState.exercises)
        .filter(exercise => exercise.status === 'completed').length;

    // First Exercise Achievement
    if (exercisesCompleted >= 1 && !progressState.achievements['first-exercise']) {
        unlockAchievement('first-exercise');
    }

    // Half Way Achievement (3 exercises)
    if (exercisesCompleted >= 3 && !progressState.achievements['half-way']) {
        unlockAchievement('half-way');
    }

    // All Exercises Achievement
    if (exercisesCompleted >= 5 && !progressState.achievements['all-exercises']) {
        unlockAchievement('all-exercises');
    }

    // Master Achievement (All exercises + full self-assessment)
    const assessmentCompleted = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.completed, 0);
    const assessmentTotal = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.total, 0);

    if (exercisesCompleted >= 5 && assessmentCompleted === assessmentTotal && !progressState.achievements['master']) {
        unlockAchievement('master');
    }
}

function unlockAchievement(achievementId) {
    progressState.achievements[achievementId] = true;

    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (achievementElement) {
        achievementElement.classList.remove('locked');
        achievementElement.classList.add('unlocked');

        // Add animation
        setTimeout(() => {
            achievementElement.style.animation = 'achievementUnlock 0.8s ease';
        }, 100);
    }

    const achievementNames = {
        'first-exercise': 'First Exercise Completed! 🎯',
        'half-way': 'Half Way There! 🔥',
        'all-exercises': 'All Exercises Complete! 🚀',
        'master': 'CRUD Master! 👑'
    };

    showNotification(`Achievement Unlocked: ${achievementNames[achievementId]}`, 'success');
    console.log(`🏆 Achievement Unlocked: ${achievementNames[achievementId]}`);

    saveProgress();
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);

    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    console.log(`📑 Switched to tab: ${tabName}`);
}

// Progress Management
function checkProgress() {
    const assessmentCompleted = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.completed, 0);
    const assessmentTotal = Object.values(progressState.checkpoints)
        .reduce((sum, topic) => sum + topic.total, 0);

    const exercisesCompleted = Object.values(progressState.exercises)
        .filter(exercise => exercise.status === 'completed').length;
    const exercisesTotal = Object.keys(progressState.exercises).length;

    const message = `
🎯 Progress Summary:

📝 Self-Assessment: ${assessmentCompleted}/${assessmentTotal} skills
🧪 Practice Exercises: ${exercisesCompleted}/${exercisesTotal} completed
🏆 Overall Progress: ${Math.round(((assessmentCompleted + exercisesCompleted) / (assessmentTotal + exercisesTotal)) * 100)}%

${exercisesCompleted >= 5 ? '🎉 Congratulations! You\'ve completed all exercises!' : 'Keep going! You\'re doing great! 🚀'}
    `.trim();

    showNotification(message, 'info');
    console.log('📊 Progress checked');
}

function resetCheckpoints() {
    if (confirm('Are you sure you want to reset all self-assessment checkpoints? This cannot be undone.')) {
        // Reset all checkpoints
        Object.keys(progressState.checkpoints).forEach(topic => {
            progressState.checkpoints[topic].skills = {};
            progressState.checkpoints[topic].completed = 0;

            // Uncheck all checkboxes
            const checkboxes = document.querySelectorAll(`[data-topic="${topic}"] input[type="checkbox"]`);
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        });

        // Update timestamp
        progressState.lastUpdated = new Date().toISOString();

        // Save and update display
        saveProgress();
        updateProgressDisplay();

        showNotification('All checkpoints have been reset', 'info');
        console.log('🔄 All checkpoints reset');
    }
}

function resetAll() {
    if (confirm('Are you sure you want to reset ALL progress? This will clear everything including completed exercises and achievements. This cannot be undone.')) {
        // Reset everything
        localStorage.removeItem('day12_progress');

        // Reload the page to reset all state
        window.location.reload();

        console.log('🔄 Complete reset initiated');
    }
}

// Data Persistence
function saveProgress() {
    try {
        localStorage.setItem('day12_progress', JSON.stringify(progressState));
        console.log('💾 Progress saved to localStorage');
    } catch (error) {
        console.error('❌ Failed to save progress:', error);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('day12_progress');
        if (saved) {
            const savedState = JSON.parse(saved);

            // Merge saved state with default state
            progressState = { ...progressState, ...savedState };
            progressState.checkpoints = { ...progressState.checkpoints, ...savedState.checkpoints };
            progressState.exercises = { ...progressState.exercises, ...savedState.exercises };
            progressState.achievements = { ...progressState.achievements, ...savedState.achievements };

            console.log('📂 Progress loaded from localStorage');
        }
    } catch (error) {
        console.error('❌ Failed to load progress:', error);
    }
}

// Export Functionality
function exportProgress() {
    const exportData = {
        timestamp: new Date().toISOString(),
        progress: progressState,
        summary: {
            assessmentCompleted: Object.values(progressState.checkpoints)
                .reduce((sum, topic) => sum + topic.completed, 0),
            assessmentTotal: Object.values(progressState.checkpoints)
                .reduce((sum, topic) => sum + topic.total, 0),
            exercisesCompleted: Object.values(progressState.exercises)
                .filter(exercise => exercise.status === 'completed').length,
            exercisesTotal: Object.keys(progressState.exercises).length,
            achievementsUnlocked: Object.values(progressState.achievements)
                .filter(Boolean).length,
            achievementsTotal: Object.keys(progressState.achievements).length
        }
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `day12-progress-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    showNotification('Progress exported successfully!', 'success');
    console.log('📤 Progress exported');
}

// Utility Functions
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

    // Hide notification after 5 seconds for longer messages
    const duration = message.length > 100 ? 6000 : 3000;
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function showWelcomeMessage() {
    setTimeout(() => {
        const assessmentCompleted = Object.values(progressState.checkpoints)
            .reduce((sum, topic) => sum + topic.completed, 0);
        const exercisesCompleted = Object.values(progressState.exercises)
            .filter(exercise => exercise.status === 'completed').length;

        if (assessmentCompleted === 0 && exercisesCompleted === 0) {
            showNotification('Welcome to Day 12: Rest & Review!\n\nStart by checking off the skills you\'ve mastered and completing the practice exercises. Good luck! 🚀', 'info');
        } else {
            showNotification(`Welcome back! You've completed ${exercisesCompleted} exercises and mastered ${assessmentCompleted} skills. Keep going! 💪`, 'success');
        }
    }, 1500);
}

// Modal Functions
function showHelp() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
            <h3 style="color: #6f42c1; margin-bottom: 1rem;">📋 Day 12 Help Guide</h3>
            <div style="line-height: 1.6;">
                <h4 style="color: #6f42c1;">How to Use This Review Session:</h4>
                <ol>
                    <li><strong>Self-Assessment:</strong> Check off skills you've mastered in each topic</li>
                    <li><strong>Practice Exercises:</strong> Complete the 5 hands-on API building challenges</li>
                    <li><strong>Code Reference:</strong> Use tabs to find essential patterns and examples</li>
                    <li><strong>Progress Tracking:</strong> Watch your progress bars fill and achievements unlock</li>
                </ol>

                <h4 style="color: #6f42c1;">Tips for Success:</h4>
                <ul>
                    <li>Complete exercises in order for the best learning experience</li>
                    <li>Use the code reference tabs when you get stuck</li>
                    <li>Export your progress to track your learning journey</li>
                    <li>Don't rush - understanding is more important than speed</li>
                </ul>
            </div>
            <div style="text-align: right; margin-top: 1rem;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #6f42c1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">Got it!</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        if (confirm('Reset all progress?')) {
            resetAll();
        }
    }

    // Ctrl/Cmd + E to export progress
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        exportProgress();
    }

    // Ctrl/Cmd + P to check progress
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        checkProgress();
    }
});

// Initialize achievements display on load
document.addEventListener('DOMContentLoaded', function() {
    // Update exercise displays based on saved state
    Object.keys(progressState.exercises).forEach(exerciseNumber => {
        updateExerciseDisplay(exerciseNumber);
    });

    // Update achievement displays
    Object.keys(progressState.achievements).forEach(achievementId => {
        if (progressState.achievements[achievementId]) {
            const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
            if (achievementElement) {
                achievementElement.classList.remove('locked');
                achievementElement.classList.add('unlocked');
            }
        }
    });
});

// Graceful error handling
window.addEventListener('error', function(event) {
    console.error('🚨 JavaScript error:', event.error);
    showNotification('A JavaScript error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred.', 'error');
});

// Export functions for global access
window.startExercise = startExercise;
window.completeExercise = completeExercise;
window.showTab = showTab;
window.checkProgress = checkProgress;
window.resetCheckpoints = resetCheckpoints;
window.resetAll = resetAll;
window.exportProgress = exportProgress;
window.showHelp = showHelp;
