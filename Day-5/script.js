// Day 5: DOM Manipulation - Light/Dark Mode Toggle Challenge
// Create an interactive theme switcher using DOM manipulation

/**
 * Initialize the theme toggle functionality
 * This function sets up the event listener for the dark mode toggle
 */
function initializeThemeToggle() {
    // Step 1: Select the elements we need
    const themeButton = document.getElementById('theme-toggle');
    const body = document.querySelector('body');

    // Step 2: Check if elements exist (error handling)
    if (!themeButton) {
        console.error('Theme toggle button not found!');
        return;
    }

    if (!body) {
        console.error('Body element not found!');
        return;
    }

    console.log('🎨 Theme toggle initialized successfully!');
    console.log('🌙 Button found:', themeButton);
    console.log('📄 Body element found:', body);

    // Step 3: Add event listener for button clicks
    themeButton.addEventListener('click', function() {
        console.log('🖱️ Theme button clicked!');

        // Step 4: Toggle the dark-mode class on the body
        const isDarkMode = body.classList.toggle('dark-mode');

        console.log('🌙 Dark mode toggled:', isDarkMode ? 'ON' : 'OFF');

        // Step 5: Update button text based on current theme
        if (isDarkMode) {
            themeButton.textContent = '☀️ Light Mode';
            console.log('📝 Button text updated to: "☀️ Light Mode"');
        } else {
            themeButton.textContent = '🌙 Dark Mode';
            console.log('📝 Button text updated to: "🌙 Dark Mode"');
        }

        // Step 6: Log current classes for debugging
        console.log('🏷️ Current body classes:', body.className);
        console.log('🎯 Dark mode active:', body.classList.contains('dark-mode'));
    });

    console.log('✅ Event listener added to theme toggle button');
}

// Additional DOM manipulation examples for learning
function demonstrateDOMMethods() {
    console.log('\n🔍 DOM Selection Methods Demonstration:');

    // getElementById
    const card = document.getElementById('theme-toggle');
    console.log('🎯 getElementById result:', card ? 'Found' : 'Not found');

    // querySelector
    const firstSkillTag = document.querySelector('.skill-tag');
    console.log('🔍 querySelector result:', firstSkillTag ? firstSkillTag.textContent : 'Not found');

    // querySelectorAll
    const allSkillTags = document.querySelectorAll('.skill-tag');
    console.log('📋 querySelectorAll result: Found', allSkillTags.length, 'skill tags');

    // getElementsByClassName
    const contactInfo = document.getElementsByClassName('contact-info');
    console.log('🏷️ getElementsByClassName result:', contactInfo.length, 'elements found');
}

// Content manipulation examples
function demonstrateContentManipulation() {
    console.log('\n✏️ Content Manipulation Examples:');

    // Find elements to manipulate
    const nameElement = document.querySelector('.name');
    const titleElement = document.querySelector('.title');

    if (nameElement) {
        // textContent example
        console.log('📝 Original name textContent:', nameElement.textContent);

        // innerHTML example (be careful with user input!)
        const originalHTML = nameElement.innerHTML;
        console.log('🔖 Original name innerHTML:', originalHTML);
    }

    if (titleElement) {
        // Style manipulation example
        const originalColor = titleElement.style.color;
        console.log('🎨 Original title color:', originalColor || 'default');
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Day 5 Challenge: DOM Manipulation & Theme Toggle');
    console.log('===================================================');

    // Initialize the main theme toggle functionality
    initializeThemeToggle();

    // Demonstrate other DOM methods
    demonstrateDOMMethods();

    // Show content manipulation examples
    demonstrateContentManipulation();

    console.log('\n🎉 Page fully loaded and interactive!');
    console.log('💡 Click the theme toggle button to switch between light and dark modes.');
    console.log('🔍 Check the console for detailed logging of DOM operations.');
});

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeThemeToggle,
        demonstrateDOMMethods,
        demonstrateContentManipulation
    };
}
