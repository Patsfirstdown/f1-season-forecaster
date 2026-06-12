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
            predictionData.data[raceName]
        ).sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = driver;

        driverSelect.appendChild(option);
    });
}

function updateChart(race, driver) {

    const driverData =
        predictionData.data[race][driver];

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
                    borderColor: '#E8002D',
                    backgroundColor: '#E8002D',
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
    const card = document.querySelector('.graph');
    //card.style.setProperty('width', '60%',"important");
    
    const graph_text = document.getElementById("graph-text");
    graph_text.textContent = "";
    const race =
        document.getElementById("raceSelect").value;

    const driver =
        document.getElementById("driverSelect").value;

    updateChart(race, driver);

});
