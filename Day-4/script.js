// Day 4: Working with Data - Skills Array Challenge
// Create an array of skill objects and use .map() to transform them

/**
 * Transform an array of skill objects into formatted strings using .map()
 * @param {Array} skillsArray - Array of skill objects with name and proficiency
 * @returns {Array} - Array of formatted strings like "HTML (Intermediate)"
 */
function formatSkills(skillsArray) {
    return skillsArray.map(skill => {
        return `${skill.name} (${skill.proficiency})`;
    });
}

// Create the skills array as specified in requirements
const skills = [
    { name: "HTML", proficiency: "Intermediate" },
    { name: "CSS", proficiency: "Advanced" },
    { name: "JavaScript", proficiency: "Beginner" }
];

// Test the function
console.log('🛠️ Skills Array Challenge');
console.log('========================');

// Show original skills array
console.log('📋 Original Skills Array:');
console.log(skills);

// Transform using .map() and show result
console.log('\n🔄 After .map() transformation:');
const formattedSkills = formatSkills(skills);
console.log(formattedSkills);

// Demonstrate individual transformations
console.log('\n📝 Individual Transformations:');
formattedSkills.forEach((skill, index) => {
    console.log(`${index + 1}. ${skill}`);
});

// Advanced examples using .filter() and .forEach()
console.log('\n🎯 Advanced Examples:');

// Filter only advanced skills
const advancedSkills = skills.filter(skill => skill.proficiency === "Advanced");
console.log('🔍 Advanced Skills:', advancedSkills);

// Use forEach to display all skills
console.log('\n📊 All Skills (using forEach):');
skills.forEach((skill, index) => {
    console.log(`${index + 1}. ${skill.name} - ${skill.proficiency} level`);
});

// Demonstrate chaining methods
console.log('\n🔗 Method Chaining Example:');
const beginnerSkillsFormatted = skills
    .filter(skill => skill.proficiency === "Beginner")
    .map(skill => `${skill.name} (${skill.proficiency})`);

console.log('🎓 Beginner Skills Formatted:', beginnerSkillsFormatted);

// Create a more comprehensive skills array
const comprehensiveSkills = [
    { name: "HTML", proficiency: "Intermediate", years: 2 },
    { name: "CSS", proficiency: "Advanced", years: 3 },
    { name: "JavaScript", proficiency: "Beginner", years: 1 },
    { name: "React", proficiency: "Intermediate", years: 1 },
    { name: "Node.js", proficiency: "Beginner", years: 0.5 }
];

console.log('\n📈 Comprehensive Skills Example:');
console.log('Original:', comprehensiveSkills);

// Transform with more details
const detailedSkills = comprehensiveSkills.map(skill => {
    return `${skill.name} (${skill.proficiency}) - ${skill.years} years experience`;
});

console.log('Formatted:', detailedSkills);

// Demonstrate different mapping strategies
console.log('\n🎨 Different Mapping Strategies:');

// Strategy 1: Simple format
const simpleFormat = comprehensiveSkills.map(skill => skill.name);
console.log('Simple names:', simpleFormat);

// Strategy 2: Proficiency levels only
const proficiencyOnly = comprehensiveSkills.map(skill => skill.proficiency);
console.log('Proficiency levels:', proficiencyOnly);

// Strategy 3: Experience summary
const experienceSummary = comprehensiveSkills.map(skill => {
    const level = skill.years < 1 ? 'Beginner' : skill.years < 2 ? 'Intermediate' : 'Advanced';
    return `${skill.name}: ${level} (${skill.years} years)`;
});
console.log('Experience summary:', experienceSummary);

// Export for use in other files (Node.js environments)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatSkills, skills };
}

// Interactive demo (if in browser)
if (typeof window !== 'undefined') {
    // Add interactive functionality for the web interface
    window.skillsData = comprehensiveSkills;
    window.formatSkills = formatSkills;
}

console.log('\n✅ Skills Array Challenge Complete!');
console.log('💡 Tip: Open the web interface to test interactively!');
