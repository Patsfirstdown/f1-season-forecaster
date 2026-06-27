let predictionData;
let positionChart;

async function loadData() {
    const response = await fetch("data/results.json");
    realData = await response.json();

    console.log(realData);
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

        row.className = "score-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span>${(item.probability * 100).toFixed(2)}%</span>
        `;

        container.appendChild(row);

    });

}

async function initialize() {

    await loadData();

    updateScores();
}

initialize();
