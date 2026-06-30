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

    const wccNext = Object.fromEntries(
        Object.entries(predictionData.wcc_data[nextRace])
            .map(([team, data]) => [team, data.expected_finish])
    );

    const wccPrevious = Object.fromEntries(
        Object.entries(predictionData.wcc_data[previousRace])
            .map(([team, data]) => [team, data.expected_finish])
    );

    const wdcNext = Object.fromEntries(
        Object.entries(predictionData.wdc_data[nextRace])
            .map(([driver, data]) => [data.driver_name, data.expected_finish])
    );

    const wdcPrevious = Object.fromEntries(
        Object.entries(predictionData.wdc_data[previousRace])
            .map(([driver, data]) => [data.driver_name, data.expected_finish])
    );

    

    const wccNextWin = Object.fromEntries(
        Object.entries(predictionData.wcc_data[nextRace])
            .map(([team, data]) => [team, data[1]])
    );

    const wccPreviousWin = Object.fromEntries(
        Object.entries(predictionData.wcc_data[previousRace])
            .map(([team, data]) => [team, data[1]])
    );

    const wdcNextWin = Object.fromEntries(
        Object.entries(predictionData.wdc_data[nextRace])
            .map(([driver, data]) => [data.driver_name, data[1]])
    );

    const wdcPreviousWin = Object.fromEntries(
        Object.entries(predictionData.wdc_data[previousRace])
            .map(([driver, data]) => [data.driver_name, data[1]])
    );

    const driverColors = predictionData.driverColor;

    console.log(wccNext)
    console.log(wdcNext)
    console.log(wccPrevious)
    console.log(wdcPrevious)
    console.log(wccNextWin)
    console.log(wdcNextWin)
    console.log(wccPreviousWin)
    console.log(wdcPreviousWin)
    
    let wccGain = {};
    let wdcGain = {};
    let wccGainAll = {};
    let wdcGainAll = {};

    for (const team in wccNext) {
        wccGainAll[team] =
            wccPrevious[team] -
            wccNext[team];
        wccGain[team] =
            wccNextWin[team] -
            wccPreviousWin[team];
    }

    for (const driver in wdcNext) {
        wdcGainAll[driver] =
            wdcPrevious[driver] -
            wdcNext[driver];
        wdcGain[driver] =
            wdcNextWin[driver] -
            wdcPreviousWin[driver];
    }

    const sortedWCC1 = Object.entries(wccGain)
        .sort((a, b) => b[1] - a[1]);
    const sortedWDC1 = Object.entries(wdcGain)
        .sort((a, b) => b[1] - a[1]);
    const sortedWCCAll = Object.entries(wccGainAll)
        .sort((a, b) => b[1] - a[1]);
    const sortedWDCAll = Object.entries(wdcGainAll)
        .sort((a, b) => b[1] - a[1]);

    
    document.getElementById("raceUpdates").innerHTML = `

        <div>
            <h3 style="text-align: center;">Post ${previousRace} Race Updates</h3>
        </div>

        <table class="update-table">

            <tr>
                <th>Category</th>
                <th>WDC</th>
                <th>WCC</th>
            </tr>

            <tr class="higher">
                <td>Biggest World Champion Gain</td>
                
                <td>${sortedWDC1[0][0]}: +${sortedWDC1[0][1].toFixed(3)*100}% Champion Odds</td>
                <td>${sortedWCC1[0][0]}: +${sortedWCC1[0][1].toFixed(3)*100}% Champion Odds</td>
            </tr>
            <tr class="lower">
                <td>Biggest World Champion Loser</td>
                <td>${sortedWDC1.at(-1)[0]}: ${sortedWDC1.at(-1)[1].toFixed(3)*100}% Champion Odds</td>
                <td>${sortedWCC1.at(-1)[0]}: ${sortedWCC1.at(-1)[1].toFixed(3)*100}% Champion Odds</td>
            </tr>
            <tr class="higher">
                <td>Biggest Overall Gain</td>
                <td>${sortedWDCAll[0][0]}: +${sortedWDCAll[0][1].toFixed(3)} Expected Positions</td>
                <td>${sortedWCCAll[0][0]}: +${sortedWCCAll[0][1].toFixed(3)} Expected Positions</td>
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                <td>${sortedWDCAll.at(-1)[0]}: ${sortedWDCAll.at(-1)[1].toFixed(3)} Expected Positions</td>
                <td>${sortedWCCAll.at(-1)[0]}: ${sortedWCCAll.at(-1)[1].toFixed(3)} Expected Positions</td>
            </tr>

        </table>

        <br>

        <div>
            <h3 style="text-align: center;">Season Trends Charts</h3>
        </div>
        
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

