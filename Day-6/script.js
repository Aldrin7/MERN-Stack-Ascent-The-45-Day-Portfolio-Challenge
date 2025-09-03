// Day 6: JavaScript Deep Dive & API Calls - Random Quote Generator
// Challenge: Create a function that fetches quotes from an API and displays them

/**
 * Main function to fetch a random quote from the Quotable API
 * Uses fetch() with .then() chaining as specified in requirements
 */
function getQuote() {
    console.log('🚀 Starting quote fetch...');

    // Show loading state
    showLoading(true);

    // Get DOM elements
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    // Step 1: Make the fetch request to the API
    // Try the primary API first, with fallback options
    const primaryAPI = 'https://api.quotable.io/random';
    const fallbackAPI = 'https://dummyjson.com/quotes/random';

    console.log('🌐 Attempting to fetch from:', primaryAPI);

    fetch(primaryAPI, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
    })
        .catch(primaryError => {
            console.warn('⚠️ Primary API failed, trying fallback:', primaryError.message);
            console.log('🔄 Switching to fallback API:', fallbackAPI);

            // Try fallback API
            return fetch(fallbackAPI, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(10000)
            });
        })
        // Step 2: Handle the response - check if it's OK
        .then(response => {
            console.log('📡 Response received:', response);
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            // Step 3: Parse the JSON data
            return response.json();
        })

        // Step 4: Handle the parsed data
        .then(data => {
            console.log('📦 Data parsed successfully:', data);

            // Validate the data structure
            if (!data || !data.content || !data.author) {
                throw new Error('Invalid data structure received from API');
            }

            // Step 5: Update the DOM with the quote
            if (quoteTextElement && quoteAuthorElement) {
                quoteTextElement.textContent = data.content;
                quoteAuthorElement.textContent = `- ${data.author}`;

                // Remove any error/loading classes
                quoteTextElement.classList.remove('error', 'loading');

                console.log('✅ Quote displayed successfully!');
                console.log(`📝 Quote: "${data.content}"`);
                console.log(`👤 Author: ${data.author}`);
                console.log(`🏷️ Tags: ${data.tags ? data.tags.join(', ') : 'None'}`);
            } else {
                throw new Error('DOM elements not found');
            }
        })

        // Step 6: Handle any errors that occurred
        .catch(error => {
            console.error('❌ Error fetching quote:', error);
            console.error('❌ Error details:', error.message);

            // Show error message in the UI
            if (quoteTextElement) {
                quoteTextElement.textContent = 'Failed to load quote. Please try again.';
                quoteTextElement.classList.add('error');
            }

            if (quoteAuthorElement) {
                quoteAuthorElement.textContent = '';
            }

            // Show user-friendly error message
            showError(`Unable to fetch quote: ${error.message}`);

            // As a final fallback, show a mock quote
            console.log('🔄 Showing fallback mock quote...');
            showMockQuote();
        })

        // Step 7: Always execute this final step
        .finally(() => {
            console.log('🏁 Fetch operation completed');

            // Hide loading state
            showLoading(false);

            // Re-enable the button
            const newQuoteBtn = document.getElementById('new-quote-btn');
            if (newQuoteBtn) {
                newQuoteBtn.disabled = false;
                newQuoteBtn.textContent = '🎲 Get New Quote';
            }
        });
}

/**
 * Show or hide the loading indicator
 * @param {boolean} show - Whether to show or hide the loading state
 */
function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    const quoteContainer = document.querySelector('.quote-container');

    if (show) {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (quoteContainer) quoteContainer.style.opacity = '0.5';
    } else {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (quoteContainer) quoteContainer.style.opacity = '1';
    }
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showError(message) {
    // For now, we'll just log to console, but you could show a toast or alert
    console.warn('⚠️ User Error:', message);

    // You could implement a toast notification here
    // showToast(message, 'error');
}

/**
 * Show a mock quote as fallback when APIs fail
 */
function showMockQuote() {
    const mockQuotes = [
        {
            content: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
            author: "Steve Jobs"
        },
        {
            content: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            content: "You miss 100% of the shots you don't take.",
            author: "Wayne Gretzky"
        },
        {
            content: "The best way to predict the future is to create it.",
            author: "Peter Drucker"
        },
        {
            content: "Believe you can and you're halfway there.",
            author: "Theodore Roosevelt"
        }
    ];

    // Pick a random mock quote
    const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];

    console.log('🎭 Showing mock quote:', randomQuote);

    // Update DOM with mock quote
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    if (quoteTextElement && quoteAuthorElement) {
        quoteTextElement.textContent = randomQuote.content;
        quoteAuthorElement.textContent = `- ${randomQuote.author}`;
        quoteTextElement.classList.remove('error', 'loading');

        console.log('✅ Mock quote displayed successfully!');
    }
}

/**
 * Share the current quote using Web Share API or fallback
 */
function shareQuote() {
    const quoteText = document.getElementById('quote-text').textContent;
    const quoteAuthor = document.getElementById('quote-author').textContent;

    if (!quoteText || quoteText === 'Click "Get New Quote" to fetch an inspirational quote from the API!') {
        showError('No quote to share. Please fetch a quote first.');
        return;
    }

    const shareText = `"${quoteText}" ${quoteAuthor}`;

    console.log('📤 Attempting to share quote:', shareText);

    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Inspirational Quote',
            text: shareText,
            url: window.location.href
        })
        .then(() => console.log('✅ Quote shared successfully!'))
        .catch(error => {
            console.log('❌ Share cancelled or failed:', error);
            fallbackShare(shareText);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        fallbackShare(shareText);
    }
}

/**
 * Fallback sharing method using clipboard or other methods
 * @param {string} text - The text to share
 */
function fallbackShare(text) {
    console.log('📋 Using fallback sharing method');

    // Try to copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('✅ Quote copied to clipboard!');
                showError('Quote copied to clipboard!');
            })
            .catch(error => {
                console.error('❌ Failed to copy to clipboard:', error);
                // Final fallback: show alert
                alert(`Share this quote:\n\n${text}`);
            });
    } else {
        // Final fallback: show alert
        alert(`Share this quote:\n\n${text}`);
    }
}

/**
 * Advanced example: Fetch quotes by tag
 * @param {string} tag - The tag to filter quotes by (e.g., 'inspiration', 'motivation')
 */
function getQuoteByTag(tag = 'inspiration') {
    console.log(`🏷️ Fetching quote with tag: ${tag}`);

    const apiUrl = `https://api.quotable.io/random?tags=${encodeURIComponent(tag)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`✅ Quote with tag "${tag}" loaded:`, data);
            // You could implement tag-specific display here
        })
        .catch(error => {
            console.error(`❌ Error fetching quote with tag "${tag}":`, error);
        });
}

/**
 * Advanced example: Get multiple quotes at once
 * @param {number} count - Number of quotes to fetch (max 50)
 */
function getMultipleQuotes(count = 5) {
    console.log(`📚 Fetching ${count} quotes...`);

    const apiUrl = `https://api.quotable.io/quotes?limit=${count}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`✅ ${data.results.length} quotes loaded:`, data.results);
            // You could implement a quote carousel or list here
        })
        .catch(error => {
            console.error(`❌ Error fetching ${count} quotes:`, error);
        });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Day 6 Challenge: Random Quote Generator');
    console.log('==========================================');

    // Set up event listeners
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const shareBtn = document.getElementById('share-btn');

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', function() {
            console.log('🖱️ New Quote button clicked');
            this.disabled = true;
            this.textContent = '⏳ Loading...';
            getQuote();
        });
        console.log('✅ New Quote button event listener added');
    } else {
        console.error('❌ New Quote button not found!');
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareQuote);
        console.log('✅ Share button event listener added');
    } else {
        console.error('❌ Share button not found!');
    }

    // Load initial quote
    console.log('🚀 Loading initial quote...');
    getQuote();

    // Demonstrate advanced features (commented out to avoid spam)
    // setTimeout(() => getQuoteByTag('motivation'), 2000);
    // setTimeout(() => getMultipleQuotes(3), 4000);

    console.log('\n💡 Tips:');
    console.log('- Open Developer Tools (F12) to see detailed console logs');
    console.log('- Try the share button to see Web Share API in action');
    console.log('- Check network tab to see the API requests');
    console.log('- Modify the code to add your own features!');
});

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getQuote,
        shareQuote,
        getQuoteByTag,
        getMultipleQuotes
    };
}
