# Day 3 – Thinking in Code (JavaScript Fundamentals)

## Overview
This day introduces **JavaScript** – the programming language that brings interactivity to websites and makes computers "think" logically.

The material is delivered as an interactive slide deck covering:

- **Introduction to JavaScript** – what it is and its role in web development
- **Adding JavaScript to HTML** – using the `<script>` tag
- **Variables and Data Types** – `let`, `const`, strings, numbers, booleans, null, undefined
- **Operators** – arithmetic (+, -, *, /), comparison (===, !==, >, <), logical (&&, ||, !)
- **Functions** – declaring functions, parameters, arguments, return statements
- **Conditional Logic** – if, else if, else statements

The challenge involves building a **Grade Calculator** application.

## What You'll Learn
1. **Programming Fundamentals** – how to write code that makes decisions
2. **JavaScript Basics** – variables, data types, and operators
3. **Function Creation** – reusable blocks of code
4. **Conditional Statements** – controlling program flow
5. **Problem Solving** – breaking down problems into logical steps

## Daily Challenge
Write a JavaScript function that takes a score (out of 100) and returns a letter grade (A, B, C, D, F).

### Requirements
- **Create a function** named `calculateGrade(score)` that:
  - Takes a numeric score (0-100) as input
  - Returns a letter grade as a string
  - Uses if/else if statements for the grading logic
- **Grading Scale:**
  - 90-100: A
  - 80-89: B
  - 70-79: C
  - 60-69: D
  - 0-59: F
- **Test the function** with multiple scores using console.log()

### How to Complete the Challenge
1. **Open the project files:**
   - `Day-3/Day-3-slides.html` – interactive slides (open in browser)
   - `Day-3/index.html` – grade calculator interface
   - `Day-3/script.js` – JavaScript file for your code

2. **Study the slides** to understand JavaScript fundamentals

3. **Implement the grade calculator** in `script.js`:
   ```javascript
   function calculateGrade(score) {
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

   // Test your function
   console.log(calculateGrade(95));  // Should output: "A"
   console.log(calculateGrade(82));  // Should output: "B"
   console.log(calculateGrade(73));  // Should output: "C"
   ```

4. **Test your solution:**
   - Open `index.html` in a web browser
   - Enter different scores to see the results
   - Open Developer Tools (F12) to check console output
   - Try the quick test buttons for common scores

5. **Enhance your solution** (optional advanced challenges):
   - Add input validation (check if score is a number between 0-100)
   - Add more detailed grading (A+, A-, B+, B-, etc.)
   - Handle invalid inputs gracefully
   - Add visual feedback for different grade ranges

## Files Structure
```
Day-3/
├── Day-3-slides.html    # Interactive presentation slides
├── index.html           # Grade calculator web interface
├── script.js            # JavaScript implementation
└── README.md           # This file
```

## Testing Your Code
1. **Console Testing:** Open `index.html` in a browser, open Developer Tools (F12), and check the Console tab
2. **UI Testing:** Use the web interface to input scores and see results
3. **Function Testing:** The provided code includes comprehensive test cases

## Key Concepts to Master
- **Variables:** `let` and `const` for storing data
- **Data Types:** Understanding strings, numbers, booleans
- **Operators:** How to compare and manipulate values
- **Functions:** Creating reusable code blocks
- **Conditionals:** Making decisions in code
- **Console:** Debugging and testing your code

## Tips for Success
1. **Start Simple:** Begin with basic if/else logic
2. **Test Frequently:** Use console.log() to see what's happening
3. **Handle Edge Cases:** Consider what happens with scores like 100, 0, or invalid inputs
4. **Read Error Messages:** They help you identify and fix problems
5. **Practice Logic:** Think step-by-step like a computer would

## Next Steps
After completing this challenge, you'll be ready for:
- **DOM Manipulation** – controlling HTML with JavaScript
- **Event Handling** – responding to user interactions
- **Arrays and Objects** – working with complex data
- **Loops** – repeating code efficiently

Remember: Programming is like learning a new language. Start with simple words (variables, functions) and gradually build sentences (programs). You've got this! 🚀
