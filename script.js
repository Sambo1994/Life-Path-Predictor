function predictLife() {
    const name = document.getElementById('name').value.trim();
    const dobInput = document.getElementById('dob').value;
    const sex = document.querySelector('input[name="sex"]:checked')?.value;

    if (!name) {
        alert("Please enter a valid name.");
        return;
    }

    const dob = new Date(dobInput);
    if (isNaN(dob.getTime())) {
        alert("Please enter a valid date of birth.");
        return;
    }

    if (!sex) {
        alert("Please select your sex.");
        return;
    }

    // Estimate lifespan
    const lifeExpectancy = getLifeExpectancy(dob.getFullYear(), sex);
    const deathYear = dob.getFullYear() + lifeExpectancy;
    const deathMonth = Math.floor(Math.random() * 12) + 1;
    const deathDay = Math.floor(Math.random() * 28) + 1;

    fetchHistoricalFigures(dob.getDate(), dob.getMonth() + 1)
        .then(figures => {
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
            console.error("Error fetching historical figures:", error);
        });
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 77, female: 80 },
        1950: { male: 76, female: 82 },
        2000: { male: 64, female: 70 },
        2025: { male: 68, female: 73 }
    };

    const years = Object.keys(baseLifeExpectancy).map(Number).sort((a, b) => a - b);
    
    for (let i = 0; i < years.length - 1; i++) {
        if (birthYear >= years[i] && birthYear < years[i + 1]) {
            const start = baseLifeExpectancy[years[i]];
            const end = baseLifeExpectancy[years[i + 1]];
            
            const interpolated = start[sex] + ((birthYear - years[i]) / (years[i + 1] - years[i])) * (end[sex] - start[sex]);
            return Math.round(interpolated);
        }
    }
    
    return baseLifeExpectancy[years[years.length - 1]][sex];
}

async function fetchHistoricalFigures(day, month) {
    try {
        const historicalFigures = [
            { name: "Albert Einstein", lifespan: 76, birthMonth: 3, birthDay: 14 },
            { name: "Leonardo da Vinci", lifespan: 67, birthMonth: 4, birthDay: 15 },
            { name: "Marie Curie", lifespan: 66, birthMonth: 11, birthDay: 7 },
            { name: "William Shakespeare", lifespan: 52, birthMonth: 4, birthDay: 23 },
            { name: "Isaac Newton", lifespan: 84, birthMonth: 1, birthDay: 4 }
        ];
        
        return historicalFigures.filter(fig => fig.birthMonth === month && fig.birthDay === day) || historicalFigures.slice(0, 3);
    } catch (error) {
        console.error("Error fetching historical figures:", error);
        return [];
    }
}

function generateLifeComparison(figures) {
    if (figures.length === 0) {
        return "<p>No historical figures found with your birth date.</p>";
    }

    return `<ul>${figures.map(fig => `<li>${fig.name}: ${fig.lifespan} years lived</li>`).join("")}</ul>`;
}

function generateLifeCode() {
    return Array.from({ length: 5 }, () => {
        const rand = Math.random();
        return rand > 0.66 ? 1 : rand > 0.33 ? 0 : -1;
    }).join('');
}
