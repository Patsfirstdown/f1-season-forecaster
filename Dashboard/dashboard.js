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

function createTemp(racename,driver_team,one_all,oldtemp,seasonWDC1) {
    if(one_all==="one"){
        currenttemp = Object.entries(
            Object.fromEntries(
                Object.entries(driver_team)
                    .map(([driver, data]) => [data.driver_name, data[1]])
            )
        );
    }
    else {
        currenttemp = Object.entries(
            Object.fromEntries(
                Object.entries(driver_team)
                    .map(([driver, data]) => [data.driver_name, data.expected_position])
            )
        );
    }

    return currenttemp
}

function createSorted(currenttemp,oldtemp) {
    let tempOther = {}
    for (const driver in currenttemp) {
        tempOther[driver] =
            oldtemp[driver] -
            currenttemp[driver];
    }

    sorted = Object.entries(tempOther)
        .sort((a, b) => b[1] - a[1]);

    return sorted
}

function updateUpdates() {
    const races = Object.keys(
        predictionData.races
    );

    let seasonWCC1=["race","driver",0];
    let seasonWCCAll=["race","driver",0];
    let seasonWDC1=["race","driver",0];
    let seasonWDCAll=["race","driver",0];

    const previousRace = races[races.length - 2];
    const driverNames = Object.keys(
        predictionData.race_data[previousRace]
    );
    
    const driverColors = predictionData.driverColor;

    let currentTempWCC1;
    let currentTempWDC1;
    let currentTempWCCAll;
    let currentTempWDCAll; 

    let oldtempWDC1;
    let oldtempWCC1;
    let oldtempWDCAll;
    let oldtempWCCAll;

    let sortedWCC1;
    let sortedWDC1;
    let sortedWCCAll;
    let sortedWDCAll;

    let teamCount=0;
    let driverCount=0;
    
    for (racename of races) {
        oldtempWDC1=sortedWDC1;
        oldtempWCC1=sortedWCC1;
        oldtempWDCAll=sortedWDCAll;
        oldtempWCCAll=sortedWCCAll;
        if (Object.hasOwn(predictionData.wcc_data, racename)) {
            teamCount++;
            
            currentTempWCC1 = createTemp(racename,predictionData.wcc_data[racename],"one",oldtempWCC1);
            currentTempWCCAll = createTemp(racename,predictionData.wcc_data[racename],"notOne",oldtempWCCAll);
            if(!oldtempWCC1) {
                console.log(oldtempWCC1);
                //skip
            }
            else {
                sortedWCC1 = createSorted(currentTempWCC1,oldtempWCC1)
                sortedWCCAll = createSorted(currentTempWCCAll,oldtempWCCAll)
    
                if(sortedWCC1[0][1]>seasonWCC1[0][0][0]) {
                    seasonWCC1=[racename,sortedWCC1[0][0],sortedWCC1[0][1]]
                }
                if(sortedWCCAll[0][1]>seasonWCC1[0][0][0]) {
                    seasonWCC1=[racename,sortedWCCAll[0][0],sortedWCCAll[0][1]]
                }
            }
        }
        if (Object.hasOwn(predictionData.wcc_data, racename)) {
            driverCount++;

            currentTempWDC1 = createTemp(racename,predictionData.wdc_data[racename],"one");
            currentTempWDCAll = createTemp(racename,predictionData.wdc_data[racename],"notOne");

            if(!oldtempWDC1) {
                //skip
                console.log(oldtempWDC1);
            }
            else {
                sortedWDC1 = createSorted(currentTempWDC1,oldtempWDC1)
                sortedWDCAll = createSorted(currentTempWDCAll,oldtempWCDAll)
    
                if(sortedWDC1[0][1]>seasonWDC1[0][0][0]) {
                    seasonWDC1=[racename,sortedWDC1[0][0],sortedWDC1[0][1]]
                };
                if(sortedWDCAll[0][1]>seasonWDC1[0][0][0]) {
                    seasonWDC1=[racename,sortedWDCAll[0][0],sortedWDCAll[0][1]]
                };
            }
        };

    };

    if (teamCount>=5) {
        const fiveCAgo = races[races.length - 5];

        fiveC1 = createTemp(racename,predictionData.wcc_data[fiveCAgo],"one");
        fiveCAll = createTemp(racename,predictionData.wcc_data[fiveCAgo],"notOne");

        fiveC1S = createSorted(currentTempWCC1,fiveC1)
        fiveCAllS = createSorted(currentTempWCCAll,fiveCAll)

        cateC=`<th>WDC</th>`
        row1C=`<td>${fiveC1[0][0]}: +${fiveC1[0][1].toFixed(3)*100}% Champion Odds</td>`
        row2C=`<td>${fiveC1.at(-1)[0]}: ${fiveC1.at(-1)[1].toFixed(3)*100}% Champion Odds</td>`
        row3C=`<td>${fiveCAllS[0][0]}: +${fiveCAllS[0][1].toFixed(3)} Expected Positions</td>`
        row4C=`<td>${fiveCAllS.at(-1)[0]}: ${fiveCAllS.at(-1)[1].toFixed(3)} Expected Positions</td>`
    };
    if (driverCount>=5) {
        const fiveDAgo = races[races.length - 5];
        fiveD1 = createTemp(racename,predictionData.wdc_data[fiveDAgo],"one");
        fiveDAll = createTemp(racename,predictionData.wdc_data[fiveDAgo],"notOne");

        fiveD1S = createSorted(currentTempWDC1,fiveD1)
        fiveDAllS = createSorted(currentTempWDCAll,fiveDAll)

        cateD=`<th>WDC</th>`
        row1D=`<td>${fiveD1[0][0]}: +${fiveD1[0][1].toFixed(3)*100}% Champion Odds</td>`
        row2D=`<td>${fiveD1.at(-1)[0]}: ${fiveD1.at(-1)[1].toFixed(3)*100}% Champion Odds</td>`
        row3D=`<td>${fiveDAllS[0][0]}: +${fiveDAllS[0][1].toFixed(3)} Expected Positions</td>`
        row4D=`<td>${fiveDAllS.at(-1)[0]}: ${fiveDAllS.at(-1)[1].toFixed(3)} Expected Positions</td>`
    };
    

    
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
            <h3 style="text-align: center;">Biggest Standings Updates</h3>
        </div>
        <table class="update-table">

            <tr>
                <th>Category</th>
                ${cateD}
                ${cateC}
            </tr>

            <tr class="higher">
                <td>Last 5 Races World Championship Gain</td>
                
                ${row1D}
                ${row1C}
            </tr>
            <tr class="lower">
                <td>Biggest World Champion Loser</td>
                ${row2D}
                ${row2C}
            </tr>
            <tr class="higher">
                <td>Biggest Overall Gain</td>
                ${row3C}
                ${row3C}
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                ${row4C}
                ${row4C}
            </tr>

        </table>

        <br>

        <div>
            <h3 style="text-align: center;">Biggest Standings Updates</h3>
        </div>
        <table class="update-table">

            <tr>
                <th>Category</th>
                <th>WDC</th>
                <th>WCC</th>
            </tr>

            <tr class="higher">
                <td>Biggest World Champion Gain</td>
                
                <td>${seasonWDC1[0][0]} ${seasonWDC1[0][1]}: +${seasonWDC1[0][2].toFixed(3)*100}% Champion Odds</td>
                <td>${seasonWCC1[0][0]} ${seasonWCC1[0][1]}: +${seasonWCC1[0][2].toFixed(3)*100}% Champion Odds</td>
            </tr>
            <tr class="lower">
                <td>Biggest World Champion Loser</td>
                <td>${seasonWDC1.at(-1)[0]} ${seasonWDC1.at(-1)[1]}: ${seasonWDC1.at(-1)[2].toFixed(3)*100}% Champion Odds</td>
                <td>${seasonWCC1.at(-1)[0]} ${seasonWCC1.at(-1)[1]}: ${seasonWCC1.at(-1)[2].toFixed(3)*100}% Champion Odds</td>
            </tr>
            <tr class="higher">
                <td>Biggest Overall Gain</td>
                <td>${seasonWDCAll[0][0]} ${seasonWDCAll[0][1]}: +${seasonWDCAll[0][2].toFixed(3)} Expected Positions</td>
                <td>${seasonWCC1[0][0]} ${seasonWCCAll[0][1]}: +${seasonWCC1[0][2].toFixed(3)} Expected Positions</td>
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                <td>${seasonWDCAll.at(-1)[0]} ${seasonWDC1.at(-1)[1]}: ${seasonWDCAll.at(-1)[2].toFixed(3)} Expected Positions</td>
                <td>${seasonWCC1.at(-1)[0]} ${seasonWCC1.at(-1)[1]}: ${seasonWCC1.at(-1)[2].toFixed(3)} Expected Positions</td>
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

