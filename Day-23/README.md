# Day 23: useEffect and Data Fetching - Connecting to Your Express API

## 🎯 Challenge Overview

Welcome to Day 23 of the MERN Stack Ascent! Today you'll master data fetching in React by using `useEffect` to connect your frontend with your Express.js backend API. You'll fetch the projects from your `GET /api/projects` endpoint and display them in a beautiful React interface.

## 📚 Learning Objectives

- **useEffect Hook**: Managing side effects and lifecycle in functional components
- **Data Fetching**: Making HTTP requests to your Express API
- **Loading States**: Handling async operations with loading indicators
- **Error Handling**: Managing API errors gracefully
- **Dependency Arrays**: Controlling when effects re-run

## 🚀 Daily Challenge

### Requirements
1. **Create an App component** that fetches data when it mounts using `useEffect`
2. **Call your Express API**: Make a GET request to `/api/projects` endpoint
3. **Handle loading state**: Show a loading spinner while fetching data
4. **Handle errors**: Display error messages if API calls fail
5. **Display results**: Render the fetched projects using `.map()` with keys
6. **Real-time updates**: Button to refresh data from the API

### Solution Approach
```javascript
// Basic data fetching pattern
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    // Fetch data from your API
    fetchData();
}, []); // Empty dependency array - runs once on mount

const fetchData = async () => {
    try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.data); // API returns {data: [...]}
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

## 🔧 Key Concepts Covered

### useEffect Fundamentals
```javascript
useEffect(() => {
    // This runs after every render

    return () => {
        // Cleanup function (runs before next effect or unmount)
    };
}, [dependencies]); // Dependencies array controls when effect re-runs
```

### Data Fetching Patterns
```javascript
// Pattern 1: Basic fetch in useEffect
useEffect(() => {
    fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data.data))
        .catch(err => setError(err.message));
}, []);

// Pattern 2: Async/await with error handling
const fetchProjects = async () => {
    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProjects(data.data);
    } catch (err) {
        setError(err.message);
    }
};
```

### Loading and Error States
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

{loading && <div>Loading projects...</div>}
{error && <div className="error">Error: {error}</div>}
{!loading && !error && projects.map(project => (...))}
```

## 📁 File Structure

```
Day-23/
├── data-fetching-challenge.html    # Main challenge file
├── README.md                        # This documentation
└── Day-23-slides.html               # Interactive slides
```

## 💡 Interactive Features

- **API Data Display**: Projects fetched from your Express.js backend
- **Loading Indicators**: Visual feedback during API calls
- **Error Handling**: Graceful error messages and retry options
- **Real-time Refresh**: Button to refetch data from the API
- **Data Statistics**: Display API response stats

## 🏆 Success Criteria

✅ **useEffect Implementation**: Data fetched automatically when component mounts
✅ **API Integration**: Calls your `GET /api/projects` endpoint correctly
✅ **Loading States**: Shows loading spinner during fetch operations
✅ **Error Handling**: Displays user-friendly error messages
✅ **Data Display**: Projects rendered with proper .map() and keys
✅ **Refresh Functionality**: Button to refetch data from API

## 🔗 Navigation

- **Previous**: [Day 22: Rendering Lists](../Day-22/README.md)
- **Next**: [Day 24: React Router & Navigation](../Day-24/README.md)

## 💡 Pro Tips

1. **Dependency Arrays**: Empty array `[]` means "run once on mount"
2. **Async in useEffect**: Always handle async operations properly
3. **Error Boundaries**: Consider using error boundaries for production apps
4. **Loading UX**: Show skeleton loaders for better user experience
5. **API URLs**: Use environment variables for API endpoints in production

## 🏆 Common Patterns

### Handling API Responses
```javascript
// Your API returns: {success: true, data: [...], count: 5}
const response = await fetch('/api/projects');
const result = await response.json();

if (result.success) {
    setProjects(result.data);  // Array of projects
    setStats({total: result.count, fetched: result.data.length});
} else {
    throw new Error('API returned error');
}
```

### Retry Logic
```javascript
const [retryCount, setRetryCount] = useState(0);

const fetchWithRetry = async (maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch('/api/projects');
            return await response.json();
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            setRetryCount(i + 1);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        }
    }
};
```

## 🚀 What's Next

Tomorrow we'll explore **React Router** for client-side routing, enabling multi-page applications within a single React app!

---

**Happy coding! 🎉**

*Built with ❤️ for the MERN Stack Ascent Challenge*
