let predictionData;
let positionChart;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
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
}

function updateChart(race, driver) {

    const driverData =
        predictionData.wdc_data[race][driver];

    const labels = [];
    const values = [];

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

    populateDriverDropdown(
        "Melbourne"
    );
}

initialize();

document
.getElementById("yearSelect")
.addEventListener("change", function() {

    populateDriverDropdown(this.value);

});

document
.getElementById("generateButton")
.addEventListener("click", function() {
    const card = document.querySelector('.graph');
    
    const graph_text = document.getElementById("graph-text");
    graph_text.textContent = "";
    const year =
        document.getElementById("yearSelect").value;

    const driver =
        document.getElementById("driverSelect").value;

    card.style.setProperty('width', '60%', "important");
    updateChart(year, driver);

});
