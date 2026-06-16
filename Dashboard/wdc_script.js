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
        Object.entries(predictionData.races);

    races.sort((a, b) => a[1] - b[1]);

    races.forEach(([raceName, round]) => {

        const option =
            document.createElement("option");

        option.value = raceName;
        option.textContent = raceName;

        raceSelect.appendChild(option);
    });
    raceSelect.selectedIndex = raceSelect.options.length - 1;
}

function populateDriverDropdown(raceName) {

    if (!raceName) {
        return;
    }

    const driverSelect =
        document.getElementById("driverSelect");

    driverSelect.innerHTML = "";

    const drivers =
        Object.keys(
            predictionData.wdc_data[raceName]
        ).sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = driver;

        driverSelect.appendChild(option);
    });
    if (drivers.includes("Max Verstappen")) {
        driverSelect.value = "Max Verstappen";
    }
}

function updateChart(race, driver) {

    const driverData =
        predictionData.wdc_data[race][driver];

    const labels = [];
    const values = [];

    const color = predictionData.driverColor[driver];

    document.getElementById("expectedFinish")
        .textContent = driverData.expected_finish.toFixed(2);
    
    document.getElementById("winProb")
        .textContent = (driverData.win_probability*100).toFixed(2) + "%";

    for (let i = 1; i <= 22; i++) {

        const key = i.toString();

        if (key in driverData) {

            labels.push(key);
            values.push(driverData[key]);
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
                        text: driver + " - " + race,
                    }
                }
            }
        });
}
function updateScore(selectedRace) {

    const wdcData = predictionData.wdc_data[selectedRace];

    const scoreList = [];

    Object.keys(wdcData).forEach(driver => {

        scoreList.push({
            driver: driver,
            probability: wdcData[driver].driver_score
        });

    });

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    dnfList.forEach(item => {

        const row = document.createElement("div");

        row.className = "score-row";
        
        row.innerHTML = `
            <span>${item.driver}</span>
            <span>${(item.probability * 100).toFixed(2)}%</span>
        `;

        container.appendChild(row);

    });

}

function updateWDCHeatmap(selectedRace) {

    const wdcData = predictionData.wdc_data[selectedRace];

    let maxProb = 0;

    Object.values(wdcData).forEach(driverData => {
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

    Object.keys(wdcData).forEach(driver => {

        html += `<tr>`;
        html += `<td class="heatmap-driver">${driver}</td>`;

        for (let pos = 1; pos <= 22; pos++) {

            const prob =
                wdcData[driver][String(pos)];

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
        "wdcHeatmap"
    ).innerHTML = html;
}

async function initialize() {

    await loadData();

    populateRaceDropdown();

    const raceSelect =
        document.getElementById("raceSelect");

    if (raceSelect.options.length > 0) {

        populateDriverDropdown(
            raceSelect.options[0].value
        );
    }
}

initialize();

document
.getElementById("raceSelect")
.addEventListener("change", function() {

    populateDriverDropdown(this.value);

});


document
.getElementById("generateButton")
.addEventListener("click", function() {
    const graph_text = document.getElementById("graph-text");
    graph_text.textContent = "";
    const race =
        document.getElementById("raceSelect").value;

    const driver =
        document.getElementById("driverSelect").value;
    const card = document.querySelector('canvas.graph');
    card.style.setProperty('width', '60%', "important");
    
    const stat = document.querySelector('.stats-card');
    stat.style.display = "block";

    const graph = document.querySelector('.graph');
    graph.style.display = "flex";

    updateChart(race, driver);
    updateWDCHeatmap(race);
    updateScore(race);
});
