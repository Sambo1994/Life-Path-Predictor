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

    const nameValue = hashName(name);
    const lifeExpectancy = getLifeExpectancy(birthYear, sex);
    const variation = ((birthYear + nameValue) % 7) - ((birthDay + nameValue) % 3);
    const predictedLifespan = lifeExpectancy + variation;
    const deathYear = birthYear + predictedLifespan;
    const deathMonth = ((birthMonth * nameValue) % 12) + 1;
    const deathDay = ((birthDay + nameValue * 3) % 28) + 1;

   // Deterministic early death calculation
    const earlyDeathFactor = ((nameValue % 7) / 100) * (0.75 - 0.50) + 0.75;
    const earlyDeathAge = Math.floor(predictedLifespan * earlyDeathFactor);
    const earlyDeathDate = {
        year: birthYear + earlyDeathAge,
        month: ((birthMonth * nameValue * 2) % 12) + 1,
        day: ((birthDay + nameValue * 5) % 28) + 1
    };

    // Deterministic suicide calculation
    const suicideFactor = ((nameValue % 7) / 100) * (0.50 - 0.25) + 0.50;
    const suicideAge = Math.floor(predictedLifespan * suicideFactor);
    const suicideDate = {
        year: birthYear + suicideAge,
        month: ((birthMonth * nameValue * 3) % 12) + 1,
        day: ((birthDay + nameValue * 7) % 28) + 1
    };

    fetchHistoricalFigures(birthDay, birthMonth, birthYear)
        .then(figures => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <h2>Life Prediction for ${name}</h2>
                <p>Estimated Lifespan: ${predictedLifespan} years</p>
                <p>Predicted Date of Passing: ${deathMonth}/${deathDay}/${deathYear}</p>
                <p>Possible Early Death (Disease/Other Causes): ${earlyDeathDate.month}/${earlyDeathDate.day}/${earlyDeathDate.year}</p>
                <p>Possible Suicide: ${suicideDate.month}/${suicideDate.day}/${suicideDate.year}</p>
                <h3>Life Path Comparison</h3>
                ${generateLifeComparison(figures)}
                <p>Life Code: ${generateLifeCode(birthYear, birthMonth, birthDay, nameValue)}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching historical figures:', error);
        });
}

// Function to generate a unique hash from the name
function hashName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000;
    }
    return hash;
}

// Function to get interpolated life expectancy
function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 50, female: 52 },
        1950: { male: 65, female: 70 },
        2000: { male: 75, female: 80 },
        2050: { male: 80, female: 85 }
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

// Function to fetch historical figures for life path comparison
async function fetchHistoricalFigures(day, month, year) {
    const historicalFigures = [
        { name: "Albert Einstein", lifespan: 76, born: 1879 },
        { name: "Leonardo da Vinci", lifespan: 67, born: 1452 },
        { name: "Marie Curie", lifespan: 66, born: 1867 },
        { name: "William Shakespeare", lifespan: 52, born: 1564 },
        { name: "Isaac Newton", lifespan: 84, born: 1643 },
        { name: "Nikola Tesla", lifespan: 86, born: 1856 },
        { name: "Ada Lovelace", lifespan: 36, born: 1815 },
        { name: "Mahatma Gandhi", lifespan: 78, born: 1869 },
        { name: "Vincent van Gogh", lifespan: 37, born: 1853 },
        { name: "Sylvia Plath", lifespan: 30, born: 1932 },
        { name: "Kurt Cobain", lifespan: 27, born: 1967 }
    ];

    return historicalFigures.filter(fig => Math.abs(fig.born - year) <= 100).slice(0, 5);
}

// Function to generate life comparison
function generateLifeComparison(figures) {
    let comparison = "<ul>";
    figures.forEach(figure => {
        comparison += `<li>${figure.name}: ${figure.lifespan} years lived</li>`;
    });
    comparison += "</ul>";
    return comparison;
}

// Function to generate a life code
function generateLifeCode(year, month, day, nameValue) {
    let code = [];
    const seed = ((year % 100) * month * day + nameValue) % 1000;

    for (let i = 0; i < 5; i++) {
        const value = (seed * (i + 1)) % 3;
        code.push(value === 2 ? Math.round(Math.random()) : value);
    }
    return code.join('');
}
