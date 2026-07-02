let realData;
let predictionData;
let resultsData;
let oldData;

async function loadData() {
    const response = await fetch("data/results.json");
    const response2 = await fetch("data/predictions.json");
    const response3 = await fetch("data/oldData.json");
    realData = await response.json();
    predictionData = await response2.json();
    oldData = await response3.json()

    console.log(realData);
}

function interpolateColor(score) {
    const start = { r: 232, g: 0, b: 45 };
    const end = { r: 255, g: 255, b: 255 };

    const r = Math.round(start.r + (end.r - start.r) * (1-score));
    const g = Math.round(start.g + (end.g - start.g) * (1-score));
    const b = Math.round(start.b + (end.b - start.b) * (1-score));

    return `rgb(${r}, ${g}, ${b})`;
}

function updateScore(year) {
    let yearHappen;
    if(year==="2026") {
        resultsData = realData["stats"];
    } else {
        resultsData = oldData[year];
    }

    const scoreList = [];

    if (year==="top10") {
        let count=0;
        resultsData = oldData[year]["scores"];
        console.log(resultsData);
        Object.keys(resultsData).forEach(place => {
            scoreList.push({
                driver: resultsData[place].driver,
                year: resultsData[place].year,
                probability: resultsData[place].score
            });

        });

        scoreList.sort((a, b) => b.probability - a.probability);

        const container =
            document.getElementById("scoreList");

        container.innerHTML = "";

        scoreList.forEach(item => {

            yearHappen=item.year

            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.probability);

            color=interpolateColor(scoreHere);

            row.className = "score-row";
            
            row.innerHTML = `
                <span>${yearHappen}</span>
                <span>${item.driver}</span>
                <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
            `;

            container.appendChild(row);

        });
    } else {
        Object.keys(resultsData).forEach(driver => {

        scoreList.push({
            driver: resultsData[driver].name,
            probability: resultsData[driver].score
        });

        });
        scoreList.sort((a, b) => b.probability - a.probability);

        const container =
            document.getElementById("scoreList");

        container.innerHTML = "";

        scoreList.forEach(item => {

            yearHappen=""

            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.probability);

            color=interpolateColor(scoreHere);

            row.className = "score-row";
            
            row.innerHTML = `
                <span>${yearHappen}</span>
                <span>${item.driver}</span>
                <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
            `;

            container.appendChild(row);

        });
    }
}

function updateBetterScore(year) {
    let yearHappen;
    if(year==="2026") {
        resultsData = realData["stats"];
    } else {
        resultsData = oldData[year];
    }

    const betterList = [];

    if (year==="top10") {
        const warning=document.getElementById("yearWarning");
        warning.innerHTML = '<p class="info">Top 10 Final Season Scores since 2018</p>';
        let count=0;
        resultsData = oldData[year]["betterScores"];
        console.log(resultsData);
        Object.keys(resultsData).forEach(place => {
            console.log(place);
            betterList.push({
                driver: resultsData[place].driver,
                year: resultsData[place].year,
                probability: resultsData[place].score
            });

        });
        console.log(betterList)
        betterList.sort((a, b) => b.probability - a.probability);

        const container =
            document.getElementById("betterScoreList");

        container.innerHTML = "";

        betterList.forEach(item => {

            yearHappen=item.year

            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.probability);

            color=interpolateColor(scoreHere);

            row.className = "score-row";
            
            row.innerHTML = `
                <span>${yearHappen}</span>
                <span>${item.driver}</span>
                <span style="color:${color};">${(item.probability).toFixed(3)}</span>
            `;

            container.appendChild(row);

        });
    } else {
        Object.keys(resultsData).forEach(driver => {

        betterList.push({
            driver: resultsData[driver].name,
            probability: resultsData[driver].betterScore
        });

        });
        betterList.sort((a, b) => b.probability - a.probability);

        const container =
            document.getElementById("betterScoreList");

        container.innerHTML = "";

        betterList.forEach(item => {

            yearHappen=""

            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.probability);

            color=interpolateColor(scoreHere);

            row.className = "score-row";
            
            row.innerHTML = `
                <span>${yearHappen}</span>
                <span>${item.driver}</span>
                <span style="color:${color};">${(item.probability).toFixed(3)}</span>
            `;

            container.appendChild(row);

        });
    }

}

function populateYearDropdown() {
    const yearSelect =
        document.getElementById("yearSelect");

    const years =
        Object.keys(oldData);

    years.sort((a, b) => a[1] - b[1]);

    for (const year of years) {
        if (year==="top10") {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = "Top 10 Season Scores";
            yearSelect.appendChild(option);
        } else {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }
    const option = document.createElement("option");
    option.value = 2026;
    option.textContent = 2026;
    yearSelect.appendChild(option);
    yearSelect.selectedIndex = yearSelect.options.length - 1;
}

async function initialize() {

    await loadData();

    populateYearDropdown();

    const year = document.getElementById("yearSelect").value;

    updateScore(year);
    updateBetterScore(year);
}

initialize();

document
.getElementById("yearSelect")
.addEventListener("change", function() {
    const year = document.getElementById("yearSelect").value;
    updateScore(year);
    updateBetterScore(year);
});
