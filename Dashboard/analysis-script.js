let predictionData;
let positionChart;
let volatilityChart = null;

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

function populateDriver1Dropdown(raceName) {

    if (!raceName) {
        return;
    }

    const driverSelect =
        document.getElementById("driverSelect1");

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
    if (drivers.includes("Max Verstappen")) {
        driverSelect.value = "Max Verstappen";
    }
}

function populateDriver2Dropdown(raceName) {
    if (!raceName) {
        return;
    }

    const driver1Select =
        document.getElementById("driverSelect1").value;
  
    const driverSelect =
        document.getElementById("driverSelect2");

    driverSelect.innerHTML = "";

    const drivers =
        Object.keys(
            predictionData.race_data[raceName]
        )
        .filter(driver => driver !== driver1Select)
        .sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = driver;

        driverSelect.appendChild(option);
    });
    if (drivers.includes("Charles Leclerc") &&
        driver1Select !== "Charles Leclerc") {
        driverSelect.value = "Charles Leclerc";
    }
}


function updateVolatilityChart(selectedRace) {

    const raceData =
        predictionData.race_data[selectedRace];

    const scatterData = [];

    Object.keys(raceData).forEach(driver => {

        scatterData.push({
            x: raceData[driver].expected_finish,
            y: raceData[driver].position_std,
            driver: driver
        });

    });

    const ctx =
        document.getElementById("expected-scatter");

    if (volatilityChart) {
        volatilityChart.destroy();
    }

    volatilityChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Drivers",
                data: scatterData,
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,

            scales: {
                x: {
                    reverse: true,
                    title: {
                        display: true,
                        text: "Expected Finish"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Position Volatility"
                    }
                }
            },

            plugins: {
                tooltip: {
                    callbacks: {

                        title: function(context) {

                            return context[0].raw.driver;

                        },

                        label: function(context) {

                            return [
                                `Expected Finish: ${context.raw.x.toFixed(2)}`,
                                `Volatility: ${context.raw.y.toFixed(2)}`
                            ];

                        }
                    }
                },

                legend: {
                    display: false
                }
            }
        }
    });
}

function compareDrivers() {

    const race =
        document.getElementById("raceSelect").value;

    const driverA =
        document.getElementById("driverSelect1").value;

    const driverB =
        document.getElementById("driverSelect2").value;

    const raceData =
        predictionData.race_data[race];

    let aAhead = 0;
    let bAhead = 0;

    for (let posA = 1; posA <= 22; posA++) {

        for (let posB = 1; posB <= 22; posB++) {

            const probA =
                raceData[driverA][String(posA)];

            const probB =
                raceData[driverB][String(posB)];

            if (posA < posB) {

                aAhead += probA * probB;

            }

            if (posB < posA) {

                bAhead += probA * probB;

            }
        }
    }

    const a =
        raceData[driverA];

    const b =
        raceData[driverB];

    document.getElementById(
        "comparisonResults"
    ).innerHTML = `

        <table class="comparison-table">

            <tr>
                <th>Metric</th>
                <th>${driverA}</th>
                <th>${driverB}</th>
            </tr>

            <tr>
                <td>Expected Finish</td>
                <td>${a.expected_finish.toFixed(2)}</td>
                <td>${b.expected_finish.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Volatility</td>
                <td>${a.position_std.toFixed(2)}</td>
                <td>${b.position_std.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Win %</td>
                <td>${(a.win_probability * 100).toFixed(2)}%</td>
                <td>${(b.win_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>Podium %</td>
                <td>${(a.podium_probability * 100).toFixed(2)}%</td>
                <td>${(b.podium_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>Points %</td>
                <td>${(a.points_probability * 100).toFixed(2)}%</td>
                <td>${(b.points_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>DNF %</td>
                <td>${(a.dnf_probability * 100).toFixed(2)}%</td>
                <td>${(b.dnf_probability * 100).toFixed(2)}%</td>
            </tr>

        </table>

        <br>

        <h4>Head-to-Head</h4>

        <p>
            ${driverA} ahead:
            ${(aAhead * 100).toFixed(2)}%
        </p>

        <p>
            ${driverB} ahead:
            ${(bAhead * 100).toFixed(2)}%
        </p>

    `;
}

async function initialize() {

    await loadData();

    populateRaceDropdown();

    const raceSelect =
        document.getElementById("raceSelect");

    if (raceSelect.options.length > 0) {

        populateDriver1Dropdown(
            raceSelect.options[0].value
        );
        const driverSelect1 = 
          document.getElementById("driver1Select");
      
        populateDriver2Dropdown(
              raceSelect.options[0].value,
              driverSelect1
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
    .getElementById("driverSelect1")
    .addEventListener("change", () => {

        const race =
            document.getElementById("raceSelect").value;

        populateDriver2Dropdown(race);

    });

document
.getElementById("generateDriverButton")
.addEventListener("click", function() {
    
    const race =
        document.getElementById("raceSelect").value;

    const driver1 =
        document.getElementById("driverSelect1").value;

    const driver2 =
        document.getElementById("driverSelect2").value;

    compareDrivers();
    updateVolatilityChart(race);
});
