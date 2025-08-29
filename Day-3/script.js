// Day 3: JavaScript Fundamentals - Grade Calculator Challenge
// Write a function that takes a score (out of 100) and returns a letter grade

/**
 * Calculate the letter grade based on a numeric score (0-100)
 * @param {number} score - The numeric score (0-100)
 * @returns {string} - The letter grade (A, B, C, D, F)
 */
function calculateGrade(score) {
    // Input validation
    if (typeof score !== 'number' || score < 0 || score > 100) {
        return 'Invalid score. Please enter a number between 0 and 100.';
    }

    // Grading logic using if/else if statements
    if (score >= 90) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}

// Test the function with various scores
console.log('🎓 Grade Calculator Results:');
console.log('-----------------------------');

// Test cases
const testScores = [95, 87, 73, 68, 55, 92, 78, 89, 61, 45];

testScores.forEach(score => {
    const grade = calculateGrade(score);
    console.log(`Score: ${score} → Grade: ${grade}`);
});

// Additional test cases with edge cases
console.log('\n📊 Edge Case Tests:');
console.log('-------------------');

console.log(`Score: 100 → Grade: ${calculateGrade(100)}`);  // Perfect score
console.log(`Score: 90 → Grade: ${calculateGrade(90)}`);    // A minimum
console.log(`Score: 89 → Grade: ${calculateGrade(89)}`);    // B maximum
console.log(`Score: 80 → Grade: ${calculateGrade(80)}`);    // B minimum
console.log(`Score: 79 → Grade: ${calculateGrade(79)}`);    // C maximum
console.log(`Score: 70 → Grade: ${calculateGrade(70)}`);    // C minimum
console.log(`Score: 69 → Grade: ${calculateGrade(69)}`);    // D maximum
console.log(`Score: 60 → Grade: ${calculateGrade(60)}`);    // D minimum
console.log(`Score: 59 → Grade: ${calculateGrade(59)}`);    // F maximum
console.log(`Score: 0 → Grade: ${calculateGrade(0)}`);      // Minimum score

// Test invalid inputs
console.log('\n⚠️  Invalid Input Tests:');
console.log('-----------------------');
console.log(`Score: -5 → ${calculateGrade(-5)}`);
console.log(`Score: 105 → ${calculateGrade(105)}`);
console.log(`Score: "85" → ${calculateGrade("85")}`);
console.log(`Score: null → ${calculateGrade(null)}`);

// Demonstrate the function with user interaction (if in browser)
if (typeof window !== 'undefined') {
    // This code runs only in browser environment
    function demonstrateGradeCalculator() {
        let userScore;

        do {
            userScore = prompt("Enter a score (0-100) to see your grade, or click Cancel to stop:");

            if (userScore !== null) {
                const score = parseFloat(userScore);
                const grade = calculateGrade(score);

                if (grade === 'Invalid score. Please enter a number between 0 and 100.') {
                    alert(grade);
                } else {
                    alert(`Your score: ${score}\nYour grade: ${grade}`);
                }
            }
        } while (userScore !== null);
    }

    // Uncomment the line below to enable interactive demo
    // demonstrateGradeCalculator();
}

// Export the function for use in other files (Node.js environments)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateGrade };
}

console.log('\n✅ Grade Calculator Challenge Complete!');
console.log('💡 Tip: Open this file in a browser to test the interactive version!');
