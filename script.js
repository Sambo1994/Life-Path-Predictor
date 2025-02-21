function predictLife() {
    const name = document.getElementById('name').value.trim();
    const dob = new Date(document.getElementById('dob').value);
    const sex = document.getElementById('sex').value;

    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    const birthYear = dob.getFullYear();
    const birthMonth = dob.getMonth() + 1;
    const birthDay = dob.getDate();

    // Generate a numeric value from name for added uniqueness
    const nameValue = hashName(name);

    // Estimate lifespan using updated life expectancy calculation
    const lifeExpectancy = getLifeExpectancy(birthYear, sex);

    // Introduce controlled variation based on name and DOB
    const variation = ((birthYear + nameValue) % 7) - ((birthDay + nameValue) % 3);
    const deathYear = birthYear + lifeExpectancy + variation;
    // Ensure death month/day are within valid ranges
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
        });
}

function hashName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000;
    }
    return hash;
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 79, female: 79 },
        1950: { male: 82, female: 82 },
        2000: { male: 79, female: 79 },
        2050: { male: 82, female: 82 }
    };

    const years = Object.keys(baseLifeExpectancy).map(Number).sort((a, b) => a - b);

    // Handle years outside dataset range
    if (birthYear <= years[0]) {
        return baseLifeExpectancy[years[0]][sex];
    }
    if (birthYear >= years[years.length - 1]) {
        return baseLifeExpectancy[years[years.length - 1]][sex];
    }

    // Find interpolation segment
    for (let i = 0; i < years.length - 1; i++) {
        if (birthYear >= years[i] && birthYear < years[i + 1]) {
            const start = baseLifeExpectancy[years[i]][sex];
            const end = baseLifeExpectancy[years[i + 1]][sex];
            const fraction = (birthYear - years[i]) / (years[i + 1] - years[i]);
            return Math.round(start + (end - start) * fraction);
        }
    }

    return baseLifeExpectancy[years[years.length - 1]][sex]; // Fallback
}

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

        return historicalFigures.filter(fig => Math.abs(fig.born - year) <= 100).slice(0, 5);
    } catch (error) {
        console.error('Error fetching historical figures:', error);
        return [];
    }
}

function generateLifeComparison(figures) {
    return figures.length 
        ? `<ul>${figures.map(fig => `<li>${fig.name}: ${fig.lifespan} years</li>`).join('')}</ul>`
        : "<p>No comparable historical figures found</p>";
}

function generateLifeCode(year, month, day, nameValue) {
    const seed = ((year % 100) * month * day + nameValue) % 1000;
    return Array.from({length: 5}, (_, i) => 
        ((seed * (i + 1)) % 3 === 2) ? Math.round(Math.random()) : ((seed * (i + 1)) % 3)
    ).join('');
}
