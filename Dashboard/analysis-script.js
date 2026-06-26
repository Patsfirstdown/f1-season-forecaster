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
            driver: driver,
            color: predictionData.driverColor[driver],
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
                pointHoverRadius: 10,
                backgroundColor: (context) => context.raw.color,
                borderColor: "#fff",
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true,

            scales: {
                x: {
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

function compateMetric(driver1data,driver2data) {
    if (driver1data < driver2data) {
        return ["ignore","higher"];
    }
    if (driver2data < driver1data) {
        return ["higher","ignore"];
    }
     return ["tie","tie"]
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

    const [expected_winnerB,expected_winnerA]=compateMetric(a.expected_finish,b.expected_finish)
    const [std_winnerB,std_winnerA]=compateMetric(a.position_std,b.position_std)
    const [win_winnerA,win_winnerB]=compateMetric(a.win_probability,b.win_probability)
    const [podium_winnerA,podium_winnerB]=compateMetric(a.podium_probability,b.podium_probability)
    const [points_winnerA,points_winnerB]=compateMetric(a.points_probability,b.points_probability)
    const [dnf_winnerB,dnf_winnerA]=compateMetric(a.dnf_probability,b.dnf_probability)

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
                <td class=${expected_winnerA}>${a.expected_finish.toFixed(2)}</td>
                <td class=${expected_winnerB}>${b.expected_finish.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Volatility</td>
                <td class=${std_winnerA}>${a.position_std.toFixed(2)}</td>
                <td class=${std_winnerB}>${b.position_std.toFixed(2)}</td>
            </tr>

            <tr>
                <td>Win %</td>
                <td class=${win_winnerA}>${(a.win_probability * 100).toFixed(2)}%</td>
                <td class=${win_winnerB}>${(b.win_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>Podium %</td>
                <td class=${podium_winnerA}>${(a.podium_probability * 100).toFixed(2)}%</td>
                <td class=${podium_winnerB}>${(b.podium_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>Points %</td>
                <td class=${points_winnerA}>${(a.points_probability * 100).toFixed(2)}%</td>
                <td class=${points_winnerB}>${(b.points_probability * 100).toFixed(2)}%</td>
            </tr>

            <tr>
                <td>DNF %</td>
                <td class=${dnf_winnerA}>${(a.dnf_probability * 100).toFixed(2)}%</td>
                <td class=${dnf_winnerB}>${(b.dnf_probability * 100).toFixed(2)}%</td>
            </tr>

        </table>

        <br>

        <h4>Head-to-Head</h4>

        <p>
            ${driverA} forecasted ahead:
            ${(aAhead * 100).toFixed(2)}%
        </p>

        <p>
            ${driverB} forecasted ahead:
            ${(bAhead * 100).toFixed(2)}%
        </p>
        <br>
        <div>
            <canvas class="graph" id="driverCompareChart"></canvas>
        </div>
    `;

    driverCompareChart(a,b,driverA,driverB);
}

function driverCompareChart(driverA,driverB,nameA,nameB) {
    const labels = [];
    const valuesA = [];
    const valuesB = [];

    for (let i = 1; i <= 22; i++) {

        const key = i.toString();
        labels.push(key);

        if (key in driverA) {
            
            valuesA.push(driverA[key]);
        }
        else {
            valuesA.push(0);
        }
        if (key in driverB) {

            valuesB.push(driverB[key]);
        }
        else {
            valuesB.push(0);
        }
    }
    let dnf_true = false;

    if ("dnf_probability" in driverA) {
        dnf_true = true;

        labels.push("DNF");
        valuesA.push(driverA["dnf_probability"]);
        
    }
    if (dnf_true) {
        if ("dnf_probability" in driverB) {
            dnf_true = true;
            valuesB.push(driverB["dnf_probability"]);
        }
    }
    else{
        if ("DNF" in driverB) {
    
            labels.push("DNF");
            valuesB.push(driverB["dnf_probability"]);
        }
    }

    if (positionChart) {
        positionChart.destroy();
    }
    let colorA = predictionData.driverColor[nameA];
    let colorB = predictionData.driverColor[nameB];

    const backgroundA = predictionData.driverColor[nameA];
    const backgroundB = predictionData.driverColor[nameB];

    console.log(colorA);
    console.log(colorB);
    
    if (colorA === colorB) {
        colorB = pattern.draw('square', colorB);
    }

    const ctx =
        document
        .getElementById("driverCompareChart")
        .getContext("2d");

    positionChart =
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: `${nameA} Probability (%)`,
                    data: valuesA,
                    borderColor: colorA,
                    backgroundColor: colorA,
                },
                {
                    label: `${nameB} Probability (%)`,
                    data: valuesB,
                    borderColor: colorB,
                    backgroundColor: colorB,
                }]
            },

            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: nameA + " vs " + nameB,
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
    .getElementById("raceSelect")
    .addEventListener("change", () => {

        const race =
            document.getElementById("raceSelect").value;

        populateDriver1Dropdown(race);

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
