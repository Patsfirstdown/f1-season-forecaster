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

    for (let i = 1; i <= 22; i++) {

        const key = i.toString();

        if (key in driverData) {

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
                    borderColor: '#E8002D',
                    backgroundColor: '#E8002D',
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
    const card = document.querySelector('.graph');
    
    const graph_text = document.getElementById("graph-text");
    graph_text.textContent = "";
    const race =
        document.getElementById("raceSelect").value;

    const team =
        document.getElementById("teamSelect").value;

    card.style.setProperty('width', '60%', "important");
    updateChart(race, team);

});
