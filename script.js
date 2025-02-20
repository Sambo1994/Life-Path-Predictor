function predictLife() {
    const name = document.getElementById('name').value;
    const dob = new Date(document.getElementById('dob').value);
    const sex = document.getElementById('sex').value;

    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    const birthYear = dob.getFullYear();
    const birthMonth = dob.getMonth() + 1;
    const birthDay = dob.getDate();

    // Estimate lifespan based on historical life expectancy
    const lifeExpectancy = getLifeExpectancy(birthYear, sex);

    // Introduce more randomness in the death prediction
    const variation = (birthYear % 10) - (birthDay % 5); // Add slight variation based on birth date
    const deathYear = birthYear + lifeExpectancy + variation;
    const deathMonth = ((birthMonth + birthDay) % 12) + 1; // More varied month
    const deathDay = ((birthDay * 3) % 28) + 1; // More varied day

    // Fetch historical figures born on the same date
    fetchHistoricalFigures(birthDay, birthMonth, birthYear)
        .then(figures => {
            // Display the results
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <h2>Life Prediction for ${name}</h2>
                <p>Estimated Lifespan: ${lifeExpectancy + variation} years</p>
                <p>Predicted Date of Passing: ${deathMonth}/${deathDay}/${deathYear}</p>
                <h3>Life Path Comparison</h3>
                ${generateLifeComparison(figures)}
                <p>Life Code: ${generateLifeCode(birthYear, birthMonth, birthDay)}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching historical figures:', error);
        });
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 74, female: 79 },
        1950: { male: 61, female: 72 },
        2000: { male: 59, female: 68 }, // Adjusted trend for 1950-2000
        2025: { male: 41, female: 59 }  // Adjusted trend for 2000-2025
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

        // Filter figures based on birth century for more relevant comparison
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

function generateLifeCode(year, month, day) {
    let code = [];
    const seed = (year % 100) * month * day; // Unique seed for variation

    for (let i = 0; i < 5; i++) {
        const value = (seed * (i + 1)) % 3; // Ensures 3 different possible values
        if (value === 0) {
            code.push(0);
        } else if (value === 1) {
            code.push(1);
        } else {
            code.push(Math.round(Math.random())); // More dynamic randomness
        }
    }
    return code.join('');
}
