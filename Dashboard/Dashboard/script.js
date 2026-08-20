let predictionData;
let positionChart;

const d = new Date();
let year = d.getFullYear();

async function loadData() {
    const response = await fetch("data/"+year+"/predictions.json");
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
        option.textContent = round[1];

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
        option.textContent = predictionData.race_data[raceName][driver].driver_name;

        driverSelect.appendChild(option);
    });
    if (drivers.includes("max_verstappen")) {
        driverSelect.value = "max_verstappen";
    }
}

function updateChart(race, driver) {

    const driverData =
        predictionData.race_data[race][driver];

    const raceName = predictionData.races[race][1];
    
    document.getElementById("expectedFinish")
        .textContent = driverData.expected_finish.toFixed(2);

     document.getElementById("std")
        .textContent = driverData.position_std.toFixed(2);
    
    document.getElementById("winProb")
        .textContent = (driverData.win_probability*100).toFixed(2) + "%";
    
    document.getElementById("podiumProb")
        .textContent = (driverData.podium_probability*100).toFixed(2) + "%";

    document.getElementById("pointsProb")
        .textContent = (driverData.points_probability*100).toFixed(2) + "%";
    
    document.getElementById("dnfProb")
        .textContent = (driverData.dnf_probability*100).toFixed(2) + "%";
    
    document.getElementById("score")
        .textContent = (driverData.driver_score*100).toFixed(2) + "%";

    const labels = [];
    const values = [];

    for (let i = 1; i <= 22; i++) {

        const key = i.toString();
        labels.push(key);

        if (key in driverData) {
            values.push(driverData[key]);
        }
        else {
            values.push(0);
        }
    }

    if ("dnf_probability" in driverData) {
        labels.push("DNF");
        values.push(driverData["dnf_probability"]);
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
                        text: driverData.driver_name + " - " + raceName,
                    }
                }
            }
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
});