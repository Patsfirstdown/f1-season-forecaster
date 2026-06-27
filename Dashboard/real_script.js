let predictionData;
let positionChart;

async function loadData() {
    const response = await fetch("data/results.json");
    realData = await response.json();

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

function updateScore(selectedRace) {

    const resultsData = realData;

    const scoreList = [];

    Object.keys(resultsData).forEach(driver => {

        scoreList.push({
            driver: driver,
            probability: resultsData[driver].score
        });

    });

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {

        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);

        color=interpolateColor(scoreHere);

        row.className = "score-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span style="color:${color};">${(item.probability*100).toFixed(2)}</span>
        `;

        container.appendChild(row);

    });

}

async function initialize() {

    await loadData();

    updateScore();
}

initialize();
