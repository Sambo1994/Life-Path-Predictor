function predictLife() {
    const name = document.getElementById('name').value;
    const dob = new Date(document.getElementById('dob').value);
    const sex = document.getElementById('sex').value;

    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    // Estimate lifespan based on historical life expectancy
    const lifeExpectancy = getLifeExpectancy(dob.getFullYear(), sex);
    const deathYear = dob.getFullYear() + lifeExpectancy;
    const deathMonth = Math.floor(Math.random() * 12) + 1;
    const deathDay = Math.floor(Math.random() * 28) + 1;

    // Fetch historical figures born on the same date
    fetchHistoricalFigures(dob.getDate(), dob.getMonth() + 1)
        .then(figures => {
            // Display the results
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <h2>Life Prediction for ${name}</h2>
                <p>Estimated Lifespan: ${lifeExpectancy} years</p>
                <p>Predicted Date of Passing: ${deathMonth}/${deathDay}/${deathYear}</p>
                <h3>Life Path Comparison</h3>
                ${generateLifeComparison(figures)}
                <p>Life Code: ${generateLifeCode()}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching historical figures:', error);
        });
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 47, female: 50 },
        1950: { male: 56, female: 62 },
        2000: { male: 64, female: 70 },
        2025: { male: 68, female: 73 }
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

async function fetchHistoricalFigures(day, month) {
    try {
        // Simulated famous people list
        const historicalFigures = [
            { name: "Albert Einstein", lifespan: 76 },
            { name: "Leonardo da Vinci", lifespan: 67 },
            { name: "Marie Curie", lifespan: 66 },
            { name: "William Shakespeare", lifespan: 52 },
            { name: "Isaac Newton", lifespan: 84 }
        ];
        return historicalFigures.slice(0, 5);
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

function generateLifeCode() {
    const code = [];
    for (let i = 0; i < 5; i++) {
        const randomValue = Math.random();
        if (randomValue > 0.66) {
            code.push(1);
        } else if (randomValue > 0.33) {
            code.push(0);
        } else {
            code.push(Math.round(Math.random()));
        }
    }
    return code.join('');
}
}
