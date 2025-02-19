function predictLife() {
    const name = document.getElementById('name').value;
    const dob = new Date(document.getElementById('dob').value);
    const sex = document.getElementById('sex').value;

    if (!name || isNaN(dob.getTime())) {
        alert("Please enter a valid name and date of birth.");
        return;
    }

    // Estimate lifespan with reduced expectancy
    let lifeExpectancy = getLifeExpectancy(dob.getFullYear(), sex);
    const reduction = Math.floor(Math.random() * 11) + 10; // Random reduction between 10 and 20 years
    lifeExpectancy -= reduction;

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
            console.error('Error fetching historical figures:', error);
        });
}

function getLifeExpectancy(birthYear, sex) {
    const baseLifeExpectancy = {
        1900: { male: 47, female: 50 },
        1950: { male: 66, female: 72 },
        2000: { male: 74, female: 80 },
        2025: { male: 78, female: 83 }
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
