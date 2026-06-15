let predictionData;
let positionChart;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function updateWDCChart() {
    const races = Object.keys(
        predictionData.wdc_data
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.wdc_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    driverNames.forEach(driver => {

        const expectedPositions = races.map(race => {

            const driverData =
                predictionData.wdc_data[race][driver];

            return driverData
                ? driverData.expected_finish
                : null;

        });

        datasets.push({
            label: driver.replaceAll("_", " "),
            data: expectedPositions,
            borderColor: driverColors[driver],
            backgroundColor: driverColors[driver],
            fill: false,
            tension: 0.2,
            pointRadius: 0
        });

    });

    if (positionChart) {
        positionChart.destroy();
    }

    positionChart = new Chart(
        document.getElementById("wdcChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,

                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 22,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

function updateWCChart() {
    const races = Object.keys(
        predictionData.wcc_data
    );

    const firstRace = races[0];

    const teamNames = Object.keys(
        predictionData.wcc_data[firstRace]
    );

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

    const datasets = [];

    teamNames.forEach(team => {

        const expectedPositions = races.map(race => {

            const teamData =
                predictionData.wcc_data[race][team];

            return teamData
                ? teamData.expected_finish
                : null;

        });

        datasets.push({
            label: team.replaceAll("_", " "),
            data: expectedPositions,
            borderColor: teamColors[team],
            backgroundColor: teamColors[team],
            fill: false,
            tension: 0.2,
            pointRadius: 0
        });

    });

    if (positionChart) {
        positionChart.destroy();
    }

    positionChart = new Chart(
        document.getElementById("wccChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,

                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 11,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

function updateDriverChart() {
    const races = Object.keys(
        predictionData.race_data
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.race_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    driverNames.forEach(driver => {

        const expectedPositions = races.map(race => {

            const driverData =
                predictionData.race_data[race][driver];

            return driverData
                ? driverData.expected_finish
                : null;

        });

        datasets.push({
            label: driver.replaceAll("_", " "),
            data: expectedPositions,
            borderColor: driverColors[driver],
            backgroundColor: driverColors[driver],
            fill: false,
            tension: 0.2,
            pointRadius: 0
        });

    });

    if (positionChart) {
        positionChart.destroy();
    }

    positionChart = new Chart(
        document.getElementById("raceChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,

                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 22,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

async function initialize() {

    await loadData();

    updateDriverChart();
}

initialize();

