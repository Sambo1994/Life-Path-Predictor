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

    // Estimate lifespan based on historical life expectancy
    const lifeExpectancy = getLifeExpectancy(birthYear, sex);

    // Introduce more randomness by combining name hash and DOB
    const variation = ((birthYear + nameValue) % 7) - ((birthDay + nameValue) % 7);
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
        });
}

// Generate a numeric value from name for uniqueness
function hashName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000; // Keep the number manageable
    }
    return hash;
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 74, female: 79 },
        1950: { male: 71, female: 82 },
        2000: { male: 74, female: 79 },
        2050: { male: 71, female: 82 }
    };

    const years = Object.keys(baseLifeExpectancy).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < years.length - 1; i++) {
        if (years[i] <= birthYear && birthYear < years[i + 1]) {
            const maleStart = baseLifeExpectancy[years[i]].male;
            const femaleStart = baseLifeExpectancy[years[i]].female;
            const maleEnd = baseLifeExpectancy[years[i + 1]].male;
            const femaleEnd = baseLifeExpectancy[years[i + 1]].female;
            
            const interpolatedMale = maleStart + ((birthYear - years[i]) / (years[i + 1] - years[i])) * (maleEnd - maleStart);
            const interpolatedFemale = femaleStart + ((birthYear - years[i]) / (years[i + 1] - years[i])) * (femaleEnd - femaleStart);
            
            return sex === 'male' ? Math.round(interpolatedMale) : Math.round(interpolatedFemale);
        }
    }
    return baseLifeExpectancy[years[years.length - 1]][sex];
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
    let comparison = "<ul>";
    figures.forEach(figure => {
        comparison += `<li>${figure.name}: ${figure.lifespan} years lived</li>`;
    });
    comparison += "</ul>";
    return comparison;
}

function generateLifeCode(year, month, day, nameValue) {
    let code = [];
    const seed = ((year % 100) * month * day + nameValue) % 1000;

    for (let i = 0; i < 5; i++) {
        const value = (seed * (i + 1)) % 3;
        code.push(value === 2 ? Math.round(Math.random()) : value);
    }
    return code.join('');
}
