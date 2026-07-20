let predictionData;
let positionChart;
let currentSort = "score";
let ascending = false;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function updateDNFProbabilities(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];

    const dnfList = [];

    Object.keys(raceData).forEach(driver => {

        dnfList.push({
            driver: raceData[driver].driver_name,
            probability: raceData[driver].dnf_probability
        });

    });

    dnfList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("dnfProbabilityList");

    container.innerHTML = "";

    dnfList.forEach(item => {

        const row = document.createElement("div");

        row.className = "dnf-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span>${(item.probability * 100).toFixed(2)}%</span>
        `;

        container.appendChild(row);

    });

}

function updateScore(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];

    const dnfList = [];

    Object.keys(raceData).forEach(driver => {

        dnfList.push({
            driver: raceData[driver].driver_name,
            probability: raceData[driver].driver_score
        });

    });

    dnfList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    dnfList.forEach(item => {

        const row = document.createElement("div");

        row.className = "dnf-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span>${(item.probability * 100).toFixed(2)}%</span>
        `;

        container.appendChild(row);

    });

}

function updateExp(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];
    console.log(raceData)

    const dnfList = [];

    Object.keys(raceData).forEach(driver => {

        dnfList.push({
            driver: raceData[driver].driver_name,
            probability: raceData[driver].expected_finish
        });

    });

    dnfList.sort((b, a) => b.probability - a.probability);

    const container =
        document.getElementById("expectedPositions");

    container.innerHTML = "";

    dnfList.forEach(item => {

        const row = document.createElement("div");

        row.className = "dnf-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span>${(item.probability).toFixed(2)}</span>
        `;

        container.appendChild(row);

    });

}

function updateRaceHeatmap(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];

    let maxProb = 0;

    Object.values(raceData).forEach(driverData => {
        for (let pos = 1; pos <= 22; pos++) {
            const prob = Number(driverData[String(pos)]) || 0;
    
            if (prob > maxProb) {
                maxProb = prob;
            }
        }
    });

    let html = `
        <table class="heatmap-table">
            <tr>
                <th class="heatmap-header">Driver</th>
    `;

    for (let pos = 1; pos <= 22; pos++) {
        html += `<th class="heatmap-header">P${pos}</th>`;
    }

    html += `</tr>`;

    Object.keys(raceData).forEach(driver => {

        html += `<tr>`;
        html += `<td class="heatmap-driver">${raceData[driver]["driver_name"]}</td>`;

        for (let pos = 1; pos <= 22; pos++) {

            const prob =
                raceData[driver][String(pos)];

            const opacity = prob / maxProb;

            html += `
                <td
                    style="
                        background: rgba(232,0,45,${opacity});
                    "
                    title="${(prob*100).toFixed(2)}%"
                >
                    ${(prob*100).toFixed(1)}
                </td>
            `;
        }

        html += `</tr>`;
    });

    html += `</table>`;

    document.getElementById(
        "raceHeatmap"
    ).innerHTML = html;
}

function updateFullTable(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];
    console.log(raceData)

    const driverList = [];

    Object.keys(raceData).forEach(driver => {

        driverList.push({
            driver: raceData[driver].driver_name,
            expFinish: raceData[driver].expected_finish,
            score: raceData[driver].driver_score*100,
            dnfProb: raceData[driver].dnf_probability,
            winProb: raceData[driver][1]
        });

    });

    buildDriverTable(driverList);
}

function buildDriverTable(driverList) {

    driverList.sort((a, b) => {

        let result;

        if (typeof a[currentSort] === "string") {
            result = a[currentSort].localeCompare(b[currentSort]);
        } else {
            result = a[currentSort] - b[currentSort];
        }

        return ascending ? result : -result;
    });

    const container = document.getElementById("expectedPositions");

    const table = document.createElement("table");
    table.className = "firm-table";

    const header = table.insertRow();

    const columns = [
        ["driver", "Driver"],
        ["expFinish", "Expected Finish"],
        ["dnfProb", "DNF %"],
        ["score", "Score"],
        ["winProb","Win Chance"]
    ];

    columns.forEach(([key, label]) => {

        const th = document.createElement("th");
        th.textContent = label;

        if (currentSort === key) {
            th.textContent += ascending ? " ▲" : " ▼";
        }

        th.style.cursor = "pointer";

        th.onclick = () => {

            if (currentSort === key) {
                ascending = !ascending;
            } else {
                currentSort = key;
                ascending = true;
            }

            buildDriverTable(driverList);
        };
        header.appendChild(th);
    });

    driverList.forEach(driver => {

        const row = table.insertRow();

        row.insertCell().textContent = driver.driver;
        row.insertCell().textContent = driver.expFinish.toFixed(2);
        row.insertCell().textContent = (driver.dnfProb * 100).toFixed(1) + "%";
        const scoreCell = row.insertCell();
        scoreCell.textContent = driver.score.toFixed(3);

        if (driver.score === 0) {
            scoreCell.classList.add("noChance");
        }
        const winCell = row.insertCell();
        winCell.textContent = (driver.winProb*100).toFixed(2) + "%";

        if (driver.winProb === 0) {
            winCell.classList.add("noChance");
        }

    });

    container.replaceChildren(table);
}

async function initialize() {

    await loadData();

    const races = Object.keys(
        predictionData.races
    );

    const nextRace=races[races.length-1];
    console.log(nextRace)

    updateFullTable(nextRace)
    updateRaceHeatmap(nextRace)
}

initialize();