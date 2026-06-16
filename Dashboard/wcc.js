let predictionData;
let positionChart;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function populateRaceDropdown() {

    const raceSelect =
        document.getElementById("raceSelect");

    const races =
        Object.entries(predictionData.races)
        .filter(([raceName]) =>
            predictionData.wcc_data.hasOwnProperty(raceName)
        )
        .sort((a, b) => a[1] - b[1]);

    races.forEach(([raceName, round]) => {

        const option =
            document.createElement("option");

        option.value = raceName;
        option.textContent = raceName;

        raceSelect.appendChild(option);
    });
    raceSelect.selectedIndex = raceSelect.options.length - 1;
}

function populateTeamDropdown(raceName) {

    if (!raceName) {
        return;
    }

    const teamSelect =
        document.getElementById("teamSelect");

    teamSelect.innerHTML = "";

    const teams =
        Object.keys(
            predictionData.wcc_data[raceName]
        ).sort();

    teams.forEach(team => {

        const option =
            document.createElement("option");

        option.value = team;
        option.textContent = team;

        teamSelect.appendChild(option);
    });
}

function updateChart(race, team) {

    const teamData =
        predictionData.wcc_data[race][team];

    const labels = [];
    const values = [];

    const teamColors = {
        "Mercedes": "#00D7B6",
        "Ferrari": "#ED1131",
        "McLaren": "#F47600",
        "Red Bull Racing": "#4781D7",
        "Alpine": "#00A1E8",
        "Racing Bulls": "#6C98FF",
        "Williams": "#1868DB",
        "Haas F1 Team": "#9C9FA2",
        "Cadillac": "#909090",
        "Audi": "#F50537",
        "Aston Martin": "#229971"
    };

    color = teamColors[team];

    document.getElementById("expectedFinish")
        .textContent = teamData.expected_finish.toFixed(2);
    
    document.getElementById("winProb")
        .textContent = teamData.win_probability.toFixed(4)*100 + "%";

    for (let i = 1; i <= 11; i++) {

        const key = i.toString();

        if (key in teamData) {

            labels.push(key);
            values.push(teamData[key]);
        }
    }

    if (positionChart) {
        positionChart.destroy();
    }

    const ctx =
        document
        .getElementById("positionChart")
        .getContext("2d");

    positionChart =
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Probability (%)",
                    data: values,
                    borderColor: color,
                    backgroundColor: color,
                }]
            },

            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: team + " - " + race,
                    }
                }
            }
        });
}

function updateScore(selectedRace) {

    const wccData = predictionData.wcc_data[selectedRace];

    const scoreList = [];

    Object.keys(wccData).forEach(team => {

        scoreList.push({
            team: team,
            probability: wdcData[team].WCC_score
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
            <span>${item.team}</span>
            <span>${(item.probability * 100).toFixed(2)}%</span>
        `;

        container.appendChild(row);

    });

}

function updateWCCHeatmap(selectedRace) {

    const wdccData = predictionData.wcc_data[selectedRace];

    let maxProb = 0;

    Object.values(wccData).forEach(teamData => {
        for (let pos = 1; pos <= 11; pos++) {
            const prob = Number(teamData[String(pos)]) || 0;
    
            if (prob > maxProb) {
                maxProb = prob;
            }
        }
    });

    let html = `
        <table class="heatmap-table">
            <tr>
                <th class="heatmap-header">Team</th>
    `;

    for (let pos = 1; pos <= 11; pos++) {
        html += `<th class="heatmap-header">P${pos}</th>`;
    }

    html += `</tr>`;

    Object.keys(wccData).forEach(team => {

        html += `<tr>`;
        html += `<td class="heatmap-driver">${team}</td>`;

        for (let pos = 1; pos <= 11; pos++) {

            const prob =
                wccData[team][String(pos)];

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
        "wccHeatmap"
    ).innerHTML = html;
}

async function initialize() {

    await loadData();

    populateRaceDropdown();

    const raceSelect =
        document.getElementById("raceSelect");

    if (raceSelect.options.length > 0) {

        populateTeamDropdown(
            raceSelect.options[0].value
        );
    }
}

initialize();

document
.getElementById("raceSelect")
.addEventListener("change", function() {

    populateTeamDropdown(this.value);

});


document
.getElementById("generateButton")
.addEventListener("click", function() {
    const graph_text = document.getElementById("graph-text");
    graph_text.textContent = "";
    const race =
        document.getElementById("raceSelect").value;

    const team =
        document.getElementById("teamSelect").value;
    
    const card = document.querySelector('canvas.graph');
    card.style.setProperty('width', '60%', "important");

    const stat = document.querySelector('.stats-card');
    stat.style.display = "block";

    const graph = document.querySelector('.graph');
    graph.style.display = "flex";
    
    updateChart(race, team);

});
