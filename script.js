function predictLife() {
    const name = document.getElementById('name').value;
    const dob = new Date(document.getElementById('dob').value);
    const sex = document.getElementById('sex').value;

    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    // Convert date components to binary and sum them
    const dayBinary = dob.getDate().toString(2);
    const monthBinary = (dob.getMonth() + 1).toString(2);
    const yearBinary = dob.getFullYear().toString(2);
    const binarySum = parseInt(dayBinary, 2) + parseInt(monthBinary, 2) + parseInt(yearBinary, 2);

    // Simplify to a two-digit number
    const predictedLifespan = binarySum % 100;

    // Generate a random death date based on the predicted lifespan
    const deathYear = dob.getFullYear() + predictedLifespan;
    const deathMonth = Math.floor(Math.random() * 12) + 1;
    const deathDay = Math.floor(Math.random() * 28) + 1;

    // Fetch historical figures born on the same date
    fetchHistoricalFigures(dob.getDate(), dob.getMonth() + 1)
        .then(figures => {
            // Display the results
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <h2>Life Prediction for ${name}</h2>
                <p>Predicted Lifespan: ${predictedLifespan} years</p>
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

async function fetchHistoricalFigures(day, month) {
    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // List of famous people with known lifespans
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
            code.push(1); // Positive
        } else if (randomValue > 0.33) {
            code.push(0); // Negative
        } else {
            code.push(Math.round(Math.random())); // Neutral (randomly 0 or 1)
        }
    }
    return code.join('');
}
