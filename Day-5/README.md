# Day 5 – Making Pages Interactive (The DOM)

## Overview
This day bridges the gap between static HTML/CSS and dynamic JavaScript by introducing the **Document Object Model (DOM)**. You'll learn how to select, manipulate, and respond to HTML elements, making your web pages truly interactive!

The material is delivered as an interactive slide deck covering:

- **DOM Structure:** Understanding the tree-like representation of HTML
- **Element Selection:** `getElementById()`, `querySelector()`, `querySelectorAll()`
- **Content Manipulation:** `textContent`, `innerHTML`, and dynamic styling
- **Event Handling:** `addEventListener()` and responding to user interactions

The challenge involves creating a **Light/Dark Mode Toggle** for your business card.

## What You'll Learn
1. **DOM Fundamentals** – How browsers represent HTML as objects
2. **Element Selection** – Finding and targeting HTML elements with JavaScript
3. **Dynamic Manipulation** – Changing content, styles, and structure in real-time
4. **Event-Driven Programming** – Responding to user interactions
5. **Interactive Design** – Building user interfaces that respond to clicks and actions

## Daily Challenge
Create a Light/Dark Mode toggle for your business card.

### Requirements
- **Add a toggle button** to your business card HTML
- **Create CSS classes** for dark mode styling (`.dark-mode`)
- **Use JavaScript** to:
  - Select the button and body elements
  - Add a click event listener to the button
  - Use `body.classList.toggle('dark-mode')` to switch themes
  - Update button text to reflect current theme
- **Test the functionality** by clicking the toggle button

### Solution Approach
```javascript
// Step 1: Select elements
const themeButton = document.getElementById('theme-toggle');
const body = document.querySelector('body');

// Step 2: Add event listener
themeButton.addEventListener('click', function() {
    // Step 3: Toggle dark mode class
    const isDark = body.classList.toggle('dark-mode');

    // Step 4: Update button text
    if (isDark) {
        themeButton.textContent = '☀️ Light Mode';
    } else {
        themeButton.textContent = '🌙 Dark Mode';
    }
});
```

## Files Structure
```
Day-5/
├── Day-5-slides.html    # Interactive presentation slides
├── business-card.html   # Business card with dark mode toggle
├── styles.css          # Light and dark mode styles
├── script.js           # JavaScript event handling
└── README.md          # This file
```

## Key Concepts to Master

### DOM Selection Methods

#### `getElementById()` - Single Element by ID
```javascript
const element = document.getElementById('my-button');
// Returns the element with id="my-button"
// Fastest method, but only finds one element
```

#### `querySelector()` - Single Element by CSS Selector
```javascript
const element = document.querySelector('.my-class');
// Returns first element matching the CSS selector
// Use any CSS selector: #id, .class, tag, [attribute]
```

#### `querySelectorAll()` - Multiple Elements
```javascript
const elements = document.querySelectorAll('.skill-tag');
// Returns NodeList of all matching elements
// Use forEach() to iterate through results
```

### Content Manipulation

#### `textContent` - Plain Text
```javascript
element.textContent = "New text content";
// Changes text, escapes HTML characters
// Safer for user input
```

#### `innerHTML` - HTML Content
```javascript
element.innerHTML = "<strong>Bold text</strong>";
// Changes HTML content, renders tags
// Be careful with user input (XSS risk)
```

#### `style` - Inline Styles
```javascript
element.style.backgroundColor = "blue";
element.style.fontSize = "20px";
// Applies inline styles directly
// Overrides CSS classes
```

### Event Handling

#### `addEventListener()` - Modern Event Binding
```javascript
element.addEventListener('click', function(event) {
    // Handle the click event
    console.log('Button clicked!');
});
```

#### Event Object Properties
```javascript
element.addEventListener('click', function(event) {
    console.log('Event type:', event.type);        // "click"
    console.log('Target element:', event.target);  // Clicked element
    console.log('Mouse position:', event.clientX, event.clientY);
});
```

## CSS Dark Mode Implementation

### HTML Structure
```html
<button id="theme-toggle">🌙 Dark Mode</button>
```

### CSS Classes
```css
/* Dark mode styles */
.dark-mode {
    background-color: #1a1a1a;
    color: #ffffff;
}

.dark-mode .card {
    background-color: #2d2d2d;
    border-color: #555555;
}

.dark-mode .name {
    color: #ffffff;
}

.dark-mode .title {
    color: #cccccc;
}
/* Add more dark mode styles as needed */
```

### JavaScript Toggle Logic
```javascript
const themeButton = document.getElementById('theme-toggle');
const body = document.querySelector('body');

themeButton.addEventListener('click', function() {
    // Toggle dark mode class
    const isDarkMode = body.classList.toggle('dark-mode');

    // Update button text
    themeButton.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});
```

## Testing Your Implementation

### 1. Open in Browser
- Open `business-card.html` in your web browser
- Click the theme toggle button
- Observe the visual changes

### 2. Check Console
- Open Developer Tools (F12)
- Check the Console tab for logging messages
- Verify event handling is working

### 3. Inspect Elements
- Use Developer Tools Elements tab
- See how classes are added/removed from the body
- Check how CSS rules are applied

## Advanced Challenges

### Challenge 1: Smooth Transitions
Add CSS transitions to make theme changes smoother:
```css
* {
    transition: background-color 0.3s, color 0.3s;
}
```

### Challenge 2: Local Storage
Remember user's theme preference:
```javascript
// Save theme preference
localStorage.setItem('theme', 'dark');

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}
```

### Challenge 3: System Theme Detection
Detect user's system preference:
```javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
    body.classList.add('dark-mode');
}
```

### Challenge 4: Multiple Theme Options
Add more theme options (blue theme, green theme, etc.):
```javascript
function setTheme(themeName) {
    // Remove all theme classes
    body.classList.remove('dark-mode', 'blue-theme', 'green-theme');
    // Add new theme class
    body.classList.add(themeName + '-theme');
}
```

## Common Issues & Solutions

### Issue: Button Not Working
**Solution:** Check that:
- Button has correct ID (`id="theme-toggle"`)
- JavaScript file is loaded (`<script src="script.js"></script>`)
- No JavaScript errors in console

### Issue: Styles Not Changing
**Solution:** Verify:
- CSS `.dark-mode` classes are defined
- Button click is triggering the event listener
- `body.classList.toggle('dark-mode')` is working

### Issue: Console Shows Errors
**Solution:** Common fixes:
- Make sure script runs after DOM loads
- Check for typos in element IDs and class names
- Verify CSS file is linked correctly

## Browser Compatibility
- **Modern browsers:** Full support for all features
- **Older browsers:** May need fallbacks for `classList.toggle()`
- **Mobile browsers:** Fully supported

## Next Steps
After mastering DOM manipulation, you'll be ready for:
- **Forms and User Input** – Collecting and validating data
- **APIs and Data Fetching** – Communicating with servers
- **Modern JavaScript** – ES6+ features and frameworks
- **Full-Stack Development** – Building complete web applications

## Best Practices
1. **Always check if elements exist** before manipulating them
2. **Use semantic HTML** for better accessibility
3. **Prefer CSS classes over inline styles** for maintainability
4. **Test on multiple browsers** for compatibility
5. **Use console.log()** for debugging during development
6. **Handle edge cases** (what if user clicks button rapidly?)

Remember: The DOM is your gateway to creating interactive, dynamic web experiences. With these skills, you can make websites that feel alive and respond beautifully to user interactions! 🎉
