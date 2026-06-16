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
            predictionData.race_data[raceName]
        ).sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = driver;

        driverSelect.appendChild(option);
    });
    if (drivers.includes("Max_Verstappen")) {
        driverSelect.value = "Max_Verstappen";
    }
}

function updateChart(race, driver) {

    const driverData =
        predictionData.race_data[race][driver];
    
    document.getElementById("expectedFinish")
        .textContent = driverData.expected_finish.toFixed(2);
    
    document.getElementById("winProb")
        .textContent = (driverData.win_probability*100).toFixed(2) + "%";
    
    document.getElementById("podiumProb")
        .textContent = (driverData.podium_probability*100).toFixed(2) + "%";

    document.getElementById("pointsProb")
        .textContent = (driverData.points_probability*100).toFixed(2) + "%";
    
    document.getElementById("dnfProb")
        .textContent = (driverData.dnf_probability*100).toFixed(2) + "%";

    const labels = [];
    const values = [];

    for (let i = 1; i <= 22; i++) {

        const key = i.toString();

        if (key in driverData) {

            labels.push(key);
            values.push(driverData[key]);
        }
    }

    if ("DNF" in driverData) {

        labels.push("DNF");
        values.push(driverData["DNF"]);
    }

    if (positionChart) {
        positionChart.destroy();
    }
    const color = predictionData.driverColor[driver];

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

function updateDNFProbabilities(selectedRace) {

    const raceData = predictionData.race_data[selectedRace];

    const dnfList = [];

    Object.keys(raceData).forEach(driver => {

        dnfList.push({
            driver: driver,
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
.getElementById("generateDriverButton")
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
    updateDNFProbabilities(race);

});
