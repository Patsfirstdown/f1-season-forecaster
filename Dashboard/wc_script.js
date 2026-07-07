let predictionData;
let positionChart;
let currentSort = "score";
let ascending = false;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function updateDriverHeatmap(selectedRace) {

    const raceData = predictionData.wdc_data[selectedRace];

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
        html += `<td class="heatmap-driver">${driver}</td>`;

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
        "driverHeatmap"
    ).innerHTML = html;
}

function updateFullDriverTable(selectedRace,previousRace) {

    const raceData = predictionData.wdc_data[selectedRace];
    const previousRaceData = predictionData.wdc_data[previousRace];

    const driverList = [];

    Object.keys(raceData).forEach(driver => {
        if(previousRaceData[driver][1]===0) {
            if(raceData[driver][1]===0) {
                driverList.push({
                    driver: raceData[driver].driver_name,
                    expFinish: raceData[driver].expected_finish,
                    winProb: raceData[driver][1],
                    lastwinProb: 0
                });
            } else {
                driverList.push({
                    driver: raceData[driver].driver_name,
                    expFinish: raceData[driver].expected_finish,
                    winProb: raceData[driver][1],
                    lastwinProb: raceData[driver][1]-previousRaceData[driver][1]
                });
            }
        } else {
            driverList.push({
                driver: raceData[driver].driver_name,
                expFinish: raceData[driver].expected_finish,
                winProb: raceData[driver][1],
                lastwinProb: raceData[driver][1]-previousRaceData[driver][1]
            });
        }


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

    const container = document.getElementById("wdcExpectedPositions");

    const table = document.createElement("table");
    table.className = "firm-table";

    const header = table.insertRow();

    const columns = [
        ["driver", "Driver"],
        ["expFinish", "Expected Finish"],
        ["winProb","Win Chance"],
        ["lastwinProb","Win % Change"]
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
        const winCell = row.insertCell();
        winCell.textContent = (driver.winProb*100).toFixed(2) + "%";
        
        if (driver.winProb === 0) {
            winCell.classList.add("noChance");
        }
        const changeWinCell = row.insertCell();
        if (driver.lastwinProb > 0) {
            changeWinCell.textContent = "+" + (driver.lastwinProb*100).toFixed(2) + "%";
            changeWinCell.classList.add("gain");
        } else if (driver.lastwinProb < 0) {
            changeWinCell.textContent = (driver.lastwinProb*100).toFixed(2) + "%";
            changeWinCell.classList.add("loss");
        } else {
            changeWinCell.textContent = "-.-%";
        }

    });

    container.replaceChildren(table);
}

function updateTeamHeatmap(selectedRace) {

    const raceData = predictionData.wcc_data[selectedRace];

    let maxProb = 0;

    Object.values(raceData).forEach(driverData => {
        for (let pos = 1; pos <= 11; pos++) {
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

    for (let pos = 1; pos <= 11; pos++) {
        html += `<th class="heatmap-header">P${pos}</th>`;
    }

    html += `</tr>`;

    Object.keys(raceData).forEach(driver => {

        html += `<tr>`;
        html += `<td class="heatmap-driver">${driver}</td>`;

        for (let pos = 1; pos <= 11; pos++) {

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
        "teamHeatmap"
    ).innerHTML = html;
}

function updateFullTeamTable(selectedRace,previousRace) {

    const raceData = predictionData.wcc_data[selectedRace];
    const previousRaceData = predictionData.wcc_data[previousRace];

    const teamList = [];

    Object.keys(raceData).forEach(teamName => {
        console.log(raceData[teamName][1]-previousRaceData[teamName][1])
        console.log(teamName)
        if(previousRaceData[teamName][1]===0) {
            if(raceData[teamName][1]===0) {
                teamList.push({
                    team: teamName,
                    expFinish: raceData[teamName].expected_finish,
                    winProb: raceData[teamName][1],
                    lastwinProb: 0
                });
            } else {
                teamList.push({
                    team: teamName,
                    expFinish: raceData[teamName].expected_finish,
                    winProb: raceData[teamName][1],
                    lastwinProb: raceData[teamName][1]-previousRaceData[teamName][1]
                });
            }
        } else {
            teamList.push({
                team: teamName,
                expFinish: raceData[teamName].expected_finish,
                winProb: raceData[teamName][1],
                lastwinProb: raceData[teamName][1]-previousRaceData[teamName][1]
            });
        }


    });

    buildTeamTable(teamList);
}

function buildTeamTable(driverList) {

    driverList.sort((a, b) => {

        let result;

        if (typeof a[currentSort] === "string") {
            result = a[currentSort].localeCompare(b[currentSort]);
        } else {
            result = a[currentSort] - b[currentSort];
        }

        return ascending ? result : -result;
    });

    const container = document.getElementById("wccExpectedPositions");

    const table = document.createElement("table");
    table.className = "firm-table";

    const header = table.insertRow();

    const columns = [
        ["team", "Team"],
        ["expFinish", "Expected Finish"],
        ["winProb","Win Chance"],
        ["lastwinProb","Win % Change"]
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

            buildTeamTable(driverList);
        };
        header.appendChild(th);
    });

    driverList.forEach(driver => {

        const row = table.insertRow();

        row.insertCell().textContent = driver.team;
        row.insertCell().textContent = driver.expFinish.toFixed(2);
        const winCell = row.insertCell();
        winCell.textContent = (driver.winProb*100).toFixed(2) + "%";
        
        if (driver.winProb === 0) {
            winCell.classList.add("noChance");
        }
        const changeWinCell = row.insertCell();
        if (driver.lastwinProb > 0) {
            changeWinCell.textContent = "+" + (driver.lastwinProb*100).toFixed(2) + "%";
            changeWinCell.classList.add("gain");
        } else if (driver.lastwinProb < 0) {
            changeWinCell.textContent = (driver.lastwinProb*100).toFixed(2) + "%";
            changeWinCell.classList.add("loss");
        } else {
            changeWinCell.textContent = "-.-%";
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
    const previousRace=races[races.length-2];
    console.log(previousRace)

    updateFullDriverTable(nextRace,previousRace)
    updateDriverHeatmap(nextRace)

    updateFullTeamTable(nextRace,previousRace)
    updateTeamHeatmap(nextRace)
}

initialize();