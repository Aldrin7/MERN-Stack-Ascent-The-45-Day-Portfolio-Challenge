// Day 25: API Testing Script for Work Experience API
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';
let testResults = { passed: 0, failed: 0, total: 0 };

// Utility function to log test results
function logTest(testName, success, details = '') {
    testResults.total++;
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`[${status}] ${testName}`);
    if (!success) {
        console.log(`       Details: ${details}`);
        testResults.failed++;
    } else {
        testResults.passed++;
    }
}

// Utility function to make API calls
async function testEndpoint(method, endpoint, data = null, expectedStatus = 200) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
        }

        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, options);
        const responseBody = await response.text();

        if (response.status === expectedStatus) {
            return { success: true, data: JSON.parse(responseBody) };
        } else {
            return {
                success: false,
                error: `Expected ${expectedStatus}, got ${response.status}`,
                body: responseBody
            };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sleep function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllTests() {
    console.log('🚀 Starting Day 25 Work Experience API Tests');
    console.log('=' .repeat(50));

    // Test 1: Health Check
    console.log('\n🔍 Testing Health Check Endpoint...');
    const healthTest = await testEndpoint('GET', '/health');
    logTest('Health Check', healthTest.success && healthTest.data.status === 'healthy');

    // Wait for server to be ready
    await sleep(500);

    // Test 2: Get All Work Experiences
    console.log('\n📋 Testing GET /api/work-experience...');
    const allExperiencesTest = await testEndpoint('GET', '/api/work-experience');
    logTest('Get All Experiences',
        allExperiencesTest.success &&
        allExperiencesTest.data.success === true &&
        Array.isArray(allExperiencesTest.data.data),
        `Found ${allExperiencesTest.data?.count || 0} experiences`
    );

    // Test 3: Get Specific Experience
    console.log('\n🔍 Testing GET /api/work-experience/:id...');
    const specificExperienceTest = await testEndpoint('GET', '/api/work-experience/1');
    logTest('Get Specific Experience',
        specificExperienceTest.success &&
        specificExperienceTest.data.success === true &&
        specificExperienceTest.data.data?.id === 1
    );

    // Test 4: Search with Query Parameters
    console.log('\n🔎 Testing Search with Query Params...');
    const searchTest = await testEndpoint('GET', '/api/work-experience?search=React');
    logTest('Search Filtering',
        searchTest.success,
        `Found ${searchTest.data?.count || 0} React-related experiences`
    );

    // Test 5: Get Statistics
    console.log('\n📊 Testing GET /api/work-experience/stats...');
    const statsTest = await testEndpoint('GET', '/api/work-experience/stats');
    logTest('Get Statistics',
        statsTest.success &&
        statsTest.data.success === true &&
        typeof statsTest.data.data === 'object',
        `Stats: ${statsTest.data?.data?.total || 0} total, ${statsTest.data?.data?.current || 0} current`
    );

    // Test 6: Create New Experience
    console.log('\n📝 Testing POST /api/work-experience (Create)...');
    const newExperience = {
        company: "Test Company Inc",
        position: "Full Stack Developer",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        location: "New York, NY",
        isCurrent: false,
        description: "Test experience for API demonstration",
        achievements: ["Built test applications", "Mentored team members"],
        technologies: ["React", "Node.js", "MongoDB"],
        companySize: "500-1000",
        industry: "Technology",
        website: "https://testcompany.com"
    };

    const createTest = await testEndpoint('POST', '/api/work-experience', newExperience, 201);
    let createdId = null;
    if (createTest.success) {
        createdId = createTest.data.data?.id;
    }
    logTest('Create New Experience',
        createTest.success,
        `Created experience with ID: ${createdId}`
    );

    await sleep(300);

    // Test 7: Update Experience (if creation was successful)
    if (createdId) {
        console.log('\n✏️ Testing PUT /api/work-experience/:id (Update)...');
        const updateData = {
            position: "Senior Full Stack Developer",
            isCurrent: true,
            endDate: null
        };
        const updateTest = await testEndpoint('PUT', `/api/work-experience/${createdId}`, updateData);
        logTest('Update Experience',
            updateTest.success &&
            updateTest.data.data?.position === 'Senior Full Stack Developer'
        );

        await sleep(300);

        // Test 8: Delete Experience
        console.log('\n🗑️ Testing DELETE /api/work-experience/:id...');
        const deleteTest = await testEndpoint('DELETE', `/api/work-experience/${createdId}`, null, 200);
        logTest('Delete Experience',
            deleteTest.success,
            `Deleted experience ID: ${createdId}`
        );

        await sleep(200);

        // Test 9: Verify Deletion
        console.log('\n🔍 Verifying deletion with GET...');
        const verifyDeleteTest = await testEndpoint('GET', `/api/work-experience/${createdId}`, null, 404);
        logTest('Verify Deletion',
            verifyDeleteTest.success === false,
            'Successfully verified experience was deleted'
        );
    }

    // Test 10: Error Handling - Invalid ID
    console.log('\n❌ Testing Error Handling (Invalid ID)...');
    const invalidIdTest = await testEndpoint('GET', '/api/work-experience/999', null, 404);
    logTest('Error Handling - Invalid ID',
        invalidIdTest.success === false,
        'API correctly returned 404 Not Found'
    );

    // Test 11: Error Handling - Invalid Data
    console.log('\n❌ Testing Error Handling (Invalid Data)...');
    const invalidDataTest = await testEndpoint('POST', '/api/work-experience', { company: "" }, 400);
    logTest('Error Handling - Invalid Data',
        invalidDataTest.success === false,
        'API correctly validated input data'
    );

    // Final Summary
    console.log('\n' + '=' .repeat(50));
    console.log('🎯 TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    console.log('=' .repeat(50));

    if (testResults.failed === 0) {
        console.log('🎉 All tests passed! Your API is working perfectly! 🚀');
    } else {
        console.log('⚠️ Some tests failed. Check your API implementation.');
        console.log(' 💡 Make sure the server is running on port 3000');
    }
}

// Handle missing fetch (Node 18+ has global fetch, older versions need polyfill)
if (typeof fetch === 'undefined') {
    console.error('❌ fetch is not available. This script requires Node.js 18+ or a fetch polyfill.');
    process.exit(1);
}

// Run tests if server is running
testEndpoint('GET', '/health')
    .then(health => {
        if (!health.success) {
            console.error('❌ API server is not running!');
            console.log('💡 Start the server first:');
            console.log('   node work-experience-api-server.js');
            process.exit(1);
        }
        return runAllTests();
    })
    .catch(error => {
        console.error('❌ Error connecting to API server:', error.message);
        console.log('💡 Make sure the server is running on http://localhost:3000');
        process.exit(1);
    });
