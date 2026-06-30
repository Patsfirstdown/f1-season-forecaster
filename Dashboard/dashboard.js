let predictionData;
let raceProbChart;
let wccProbChart;
let wdcProbChart;
let dashVolatilityChart;
let lastLegendClick = 0;
let lastDatasetIndex = null;

const defaultLegendClick =
    Chart.defaults.plugins.legend.onClick;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function updateWDCChart() {
    const races = Object.keys(
        predictionData.races
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.wdc_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;

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
            borderColor: driverColors[driver],        // line color
            backgroundColor: driverColors[driver],
            pointBackgroundColor: driverColors[driver],
            pointBorderColor: borderColor,            // white/black teammate distinction
            pointBorderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (wdcProbChart) {
        wdcProbChart.destroy();
    }

    wdcProbChart = new Chart(
        document.getElementById("wdcChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },

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

function updateWCCChart() {
    const races =
        Object.entries(predictionData.races)
        .filter(([raceName]) =>
            predictionData.wcc_data.hasOwnProperty(raceName)
        )
        .sort((a, b) => a[1] - b[1]);

    const firstRace = races[0][0];

    const teamNames = Object.keys(
        predictionData.wcc_data[firstRace]
    );

    const teamColors = predictionData.teamColor;

    const datasets = [];

    teamNames.forEach(team => {

        const expectedPositions = races.map(race => {
            const teamData =
                predictionData.wcc_data[race[0]][team];

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
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (wccProbChart) {
        wccProbChart.destroy();
    }

    wccProbChart = new Chart(
        document.getElementById("wccChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },
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
        predictionData.races
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.race_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;

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
            borderColor: driverColors[driver],        // line color
            backgroundColor: driverColors[driver],
            pointBackgroundColor: driverColors[driver],
            pointBorderColor: borderColor,            // white/black teammate distinction
            pointBorderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (raceProbChart) {
        raceProbChart.destroy();
    }

    raceProbChart = new Chart(
        document.getElementById("raceChart"),
        {
            type: "line",
            data: {
                labels: races,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },
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

function updateVolatilityChart() {

    const races = Object.keys(
        predictionData.races
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.race_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;
    
        const points = races.map(race => {
    
            const driverData =
                predictionData.race_data[race][driver];
    
            if (!driverData) {
                return null;
            }
    
            return {
                x: driverData.expected_finish,
                y: driverData.position_std,
                driver: driver,
                race: race,
            };
        }).filter(point => point !== null);
    
        datasets.push({
            label: driver,
            data: points,
            backgroundColor: driverColors[driver],
            borderColor: borderColor,
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8
        });
    });

    const ctx =
        document.getElementById("dash-expected-scatter");

    if (dashVolatilityChart) {
        dashVolatilityChart.destroy();
    }

    console.log(datasets);

    dashVolatilityChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets
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
                            const point = context[0].raw;
                            return `${point.driver} - ${point.race}`;
                        },
                
                        label: function(context) {
                            const point = context.raw;
                
                            return [
                                `Expected Finish: ${point.x.toFixed(2)}`,
                                `Volatility: ${point.y.toFixed(2)}`
                            ];
                        }
                    }
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },
                legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
            }
        }
    });
}

function updateUpdates() {
    const races = Object.keys(
        predictionData.races
    );

    console.log(races)

    const nextRace = races[races.length - 1];
    const previousRace = races[races.length - 2];

    console.log(nextRace)
    console.log(previousRace)

    const driverNames = Object.keys(
        predictionData.race_data[nextRace]
    );

    const wccNext = Object.keys(
        predictionData.wcc_data[nextRace]
    );

    const wdcNext = Object.keys(
        predictionData.wdc_data[nextRace]
    );

    const wccPrevious = Object.keys(
        predictionData.wcc_data[PreviousRace]
    );

    const wdcPrevious = Object.keys(
        predictionData.wdc_data[PreviousRace]
    );

    const driverColors = predictionData.driverColor;

    console.log(wccNext)
    console.log(wdcNext)
    console.log(wccPrevious)
    console.log(wdcPrevious)

    const wdcGain = ["test","test2"]
    const wdcGainAll = ["test3","test4"]
    const wccGain = ["test5","test6"]
    const wccGainAll = ["test7","test8"]

    document.getElementById("raceUpdates").innerHTML = `

        <table class="update-table">

            <tr>
                <th></th>
                <th>WDC</th>
                <th>WCC</th>
            </tr>

            <tr>
                <td>Biggest Championship Winner</td>
                <td>${wdcGain[0]} ${wdcGain[0]}</td>
                <td>${wccGain[0]} ${wccGain[0]}</td>
            </tr>

            <tr>
                <td>Biggest Championship Loser</td>
                <td>${wdcGain[-1]} ${wdcGain[-1]}</td>
                <td>${wccGain[-1]} ${wccGain[-1]}</td>
            </tr>

            <tr>
                <td>Biggest Winner</td>
                <td>${wdcGainAll[0]} ${wdcGainAll[0]}</td>
                <td>${wccGainAll[0]} ${wccGainAll[0]}</td>
            </tr>

            <tr>
                <td>Biggest Loser</td>
                <td>${wdcGainAll[-1]} ${wdcGainAll[-1]}</td>
                <td>${wccGainAll[-1]} ${wccGainAll[-1]}</td>
            </tr>

            

        </table>

        <br>
    `;


}

async function initialize() {

    await loadData();

    updateUpdates()
    updateDriverChart();
    updateWDCChart();
    updateWCCChart();
    updateVolatilityChart()
}

initialize();

