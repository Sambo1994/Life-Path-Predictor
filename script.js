function predictLife() {
    const name = document.getElementById('name').value.trim();
    const dobInput = document.getElementById('dob').value;
    const dob = new Date(dobInput);
    const sex = document.getElementById('sex').value;

    // Validate inputs
    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    // Ensure the date of birth is not in the future
    const today = new Date();
    if (dob > today) {
        alert("Date of birth cannot be in the future.");
        return;
    }

    const birthYear = dob.getFullYear();
    const birthMonth = dob.getMonth() + 1; // Months are 0-indexed in JavaScript
    const birthDay = dob.getDate();

    // Generate a numeric value from the name for added uniqueness
    const nameValue = hashName(name);

    // Estimate lifespan based on historical life expectancy
    const lifeExpectancy = getLifeExpectancy(birthYear, sex);

    // Introduce more randomness by combining name hash and DOB
    const variation = ((birthYear + nameValue) % 7) - ((birthDay + nameValue) % 3);
    const deathYear = birthYear + lifeExpectancy + variation;
    const deathMonth = ((birthMonth * nameValue) % 12) + 1;
    const deathDay = ((birthDay + nameValue * 3) % 28) + 1;

    // Fetch historical figures born on the same date
    fetchHistoricalFigures(birthDay, birthMonth, birthYear)
        .then(figures => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <h2>Life Prediction for ${name}</h2>
                <p>Estimated Lifespan: ${lifeExpectancy + variation} years</p>
                <p>Predicted Date of Passing: ${deathMonth}/${deathDay}/${deathYear}</p>
                <h3>Life Path Comparison</h3>
                ${generateLifeComparison(figures)}
                <p>Life Code: ${generateLifeCode(birthYear, birthMonth, birthDay, nameValue)}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching historical figures:', error);
            alert('An error occurred while fetching historical figures. Please try again.');
        });
}

// Generate a numeric value from the name for uniqueness
function hashName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000; // Keep the number manageable
    }
    return hash;
}

// Get life expectancy based on birth year and sex
function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 48, female: 51 },
        1950: { male: 66, female: 71 },
        2000: { male: 74, female: 79 },
        2050: { male: 78, female: 82 }
    };

    const years = Object.keys(baseLifeExpectancy).map(Number).sort((a, b) => a - b);

    // Find the closest year range for interpolation
    for (let i = 0; i < years.length - 1; i++) {
        if (years[i] <= birthYear && birthYear < years[i + 1]) {
            const startLifeExpectancy = baseLifeExpectancy[years[i]][sex];
            const endLifeExpectancy = baseLifeExpectancy[years[i + 1]][sex];
            const interpolationFactor = (birthYear - years[i]) / (years[i + 1] - years[i]);

            return Math.round(startLifeExpectancy + interpolationFactor * (endLifeExpectancy - startLifeExpectancy));
        }
    }

    // Default to the last available year if no range is found
    return baseLifeExpectancy[years[years.length - 1]][sex];
}

// Fetch historical figures born on the same date
async function fetchHistoricalFigures(day, month, year) {
    try {
        const historicalFigures = [
            { name: "Albert Einstein", lifespan: 76, born: 1879 },
            { name: "Leonardo da Vinci", lifespan: 67, born: 1452 },
            { name: "Marie Curie", lifespan: 66, born: 1867 },
            { name: "William Shakespeare", lifespan: 52, born: 1564 },
            { name: "Isaac Newton", lifespan: 84, born: 1643 },
            { name: "Nikola Tesla", lifespan: 86, born: 1856 },
            { name: "Ada Lovelace", lifespan: 36, born: 1815 },
            { name: "Mahatma Gandhi", lifespan: 78, born: 1869 },
        ];

        // Filter figures born within 100 years of the input year
        return historicalFigures.filter(fig => Math.abs(fig.born - year) <= 100).slice(0, 5);
    } catch (error) {
        console.error('Error fetching historical figures:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

// Generate a comparison list of historical figures
function generateLifeComparison(figures) {
    if (figures.length === 0) return "<p>No historical figures found for comparison.</p>";

    let comparison = "<ul>";
    figures.forEach(figure => {
        comparison += `<li>${figure.name}: ${figure.lifespan} years lived</li>`;
    });
    comparison += "</ul>";
    return comparison;
}

// Generate a unique life code based on birth details and name
function generateLifeCode(year, month, day, nameValue) {
    let code = [];
    const seed = ((year % 100) * month * day + nameValue) % 1000;

    for (let i = 0; i < 5; i++) {
        const value = (seed * (i + 1)) % 3;
        code.push(value === 2 ? Math.round(Math.random()) : value);
    }
    return code.join('');
}
