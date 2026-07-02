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

function normalizeWDC(driver_team) {
    const out = {};

    for (const [key, data] of Object.entries(driver_team)) {
        out[key] = {
            exp: Number(data?.expected_finish),
            winProb: Number(data?.["1"]),
            name: data?.driver_name ?? key
        };
    }

    return out;
}

function normalizeWCC(team_data) {
    const out = {};

    for (const [key, data] of Object.entries(team_data)) {
        out[key] = {
            exp: Number(data?.expected_finish),
            winProb: Number(data?.["1"]),
            name: key
        };
    }

    return out;
}

function createSorted(current, old, metric, higherIsBetter = true) {
    const diff = {};

    for (const key in current) {
        const currVal = current?.[key]?.[metric];
        const oldVal = old?.[key]?.[metric];
        if (!Number.isFinite(currVal) || !Number.isFinite(oldVal)) continue;
        if(metric==="exp") {
            diff[key] = {
                name: current[key].name,
                value: oldVal - currVal
            };
        } else {
            diff[key] = {
                name: current[key].name,
                value:  currVal - oldVal
            };
        }
    }

    return Object.entries(diff)
        .sort((a, b) => b[1].value - a[1].value);
}

function updateUpdates() {
    const races = Object.keys(
        predictionData.races
    );

    let seasonWCC1big=["race","driver",0];
    let seasonWCCAllbig=["race","driver",0];
    let seasonWDC1big=["race","driver",0];
    let seasonWDCAllbig=["race","driver",0];

    let seasonWCC1small=["race","driver",0];
    let seasonWCCAllsmall=["race","driver",0];
    let seasonWDC1small=["race","driver",0];
    let seasonWDCAllsmall=["race","driver",0];
    
    const previousRace = races[races.length - 2];
    const driverNames = Object.keys(
        predictionData.race_data[previousRace]
    );
    
    const driverColors = predictionData.driverColor;

    let currentWCC;
    let currentWDC;

    let oldtempWDC;
    let oldtempWCC;

    let sortedWCC;
    let sortedWDC;

    let teamCount=0;
    let driverCount=0;
    let firstCRace;
    let firstDRace;
    
    for (racename of races) {
        oldtempWDC=currentWDC;
        oldtempWCC=currentWCC;
        if (Object.hasOwn(predictionData.wcc_data, racename)) {
            if (teamCount<1) {
                firstCRace=racename;
            }
            teamCount++;
            currentWCC = normalizeWCC(predictionData.wcc_data[racename]);
            if(!oldtempWCC) {
                //skip
            }
            else {
                sortedWCCAll = createSorted(currentWCC,oldtempWCC,"exp")
                sortedWCC1 = createSorted(currentWCC,oldtempWCC,"winProb")

                console.log(`${sortedWCC1[0][1].value}>${seasonWCC1big[2]}`)

                if(sortedWCC1[0][1].value>seasonWCC1big[2]) {
                    console.log(`SAVE: ${racename},${sortedWCC1[0][1].name},${sortedWCC1[0][1].value}`)
                    seasonWCC1big=[racename,sortedWCC1[0][1].name,sortedWCC1[0][1].value]
                }
                if(sortedWCCAll[0][1].value>seasonWCCAllbig[2]) {
                    seasonWCCAllbig=[racename,sortedWCCAll[0][1].name,sortedWCCAll[0][1].value]
                }
                if(sortedWCC1.at(-1)[1].value<seasonWCC1small[2]) {
                    seasonWCC1small=[racename,sortedWCC1.at(-1)[1].name,sortedWCC1.at(-1)[1].value]
                }
                if(sortedWCCAll.at(-1)[1].value<seasonWCCAllsmall[2]) {
                    seasonWCCAllsmall=[racename,sortedWCCAll.at(-1)[1].name,sortedWCCAll.at(-1)[1].value]
                }
            }
        }
        if (Object.hasOwn(predictionData.wdc_data, racename)) {
            if (driverCount<1) {
                firstDRace=racename;
            }
            driverCount++;
            currentWDC = normalizeWDC(predictionData.wdc_data[racename]);
            if(!oldtempWDC) {
                //skip
            }
            else {
                sortedWDCAll = createSorted(currentWDC,oldtempWDC,"exp")
                sortedWDC1 = createSorted(currentWDC,oldtempWDC,"winProb")
    
                console.log(`${sortedWDC1[0][1].value}>${seasonWDC1big[2]}`)
                if(sortedWDC1[0][1].value>seasonWDC1big[2]) {
                    console.log(`SAVE: ${racename},${sortedWDC1[0][1].name},${sortedWDC1[0][1].value}`)
                    seasonWDC1big=[racename,sortedWDC1[0][1].name,sortedWDC1[0][1].value]
                };
                if(sortedWDCAll[0][1].value>seasonWDCAllbig[2]) {
                    seasonWDCAllbig=[racename,sortedWDCAll[0][1].name,sortedWDCAll[0][1].value]
                };
                if(sortedWDC1.at(-1)[1].value<seasonWDC1small[2]) {
                    seasonWDC1small=[racename,sortedWDC1.at(-1)[1].name,sortedWDC1.at(-1)[1].value]
                };
                if(sortedWDCAll.at(-1)[1].value<seasonWDCAllsmall[2]) {
                    seasonWDCAllsmall=[racename,sortedWDCAll.at(-1)[1].name,sortedWDCAll.at(-1)[1].value]
                };
            }
        };

    };

    if (teamCount>=5) {
        const fiveCAgo = races[races.length - 5];

        fiveC1 = normalizeWCC(predictionData.wcc_data[fiveCAgo]);

        fiveCAllS = createSorted(currentWCC,fiveC1,"exp");
        fiveC1S = createSorted(currentWCC,fiveC1,"winProb");

        cateC=`<th>WCC</th>`
        row1C=`<td>${fiveC1S[0][1].name}: +${(fiveC1S[0][1].value*100).toFixed(3)}% Champion Odds</td>`
        row2C=`<td>${fiveC1S.at(-1)[1].name}: ${(fiveC1S.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>`
        row3C=`<td>${fiveCAllS[0][1].name}: +${fiveCAllS[0][1].value.toFixed(3)} Expected Positions</td>`
        row4C=`<td>${fiveCAllS.at(-1)[1].name}: ${fiveCAllS.at(-1)[1].value.toFixed(3)} Expected Positions</td>`
    } else {
        fiveC1 = normalizeWCC(predictionData.wcc_data[firstCRace]);

        fiveCAllS = createSorted(currentWCC,fiveC1,"exp");
        fiveC1S = createSorted(currentWCC,fiveC1,"winProb");

        cateC=`<th>WCC</th>`
        row1C=`<td>${fiveC1S[0][1].name}: +${(fiveC1S[0][1].value*100).toFixed(3)}% Champion Odds</td>`
        row2C=`<td>${fiveC1S.at(-1)[1].name}: ${(fiveC1S.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>`
        row3C=`<td>${fiveCAllS[0][1].name}: +${fiveCAllS[0][1].value.toFixed(3)} Expected Positions</td>`
        row4C=`<td>${fiveCAllS.at(-1)[1].name}: ${fiveCAllS.at(-1)[1].value.toFixed(3)} Expected Positions</td>`

    }
    if (driverCount>=5) {
        const fiveDAgo = races[races.length - 5];
        fiveD1 = normalizeWDC(predictionData.wdc_data[fiveDAgo]);

        fiveDAllS = createSorted(currentWDC,fiveD1,"exp");
        fiveD1S = createSorted(currentWDC,fiveD1,"winProb");

        cateD=`<th>WDC</th>`
        row1D=`<td>${fiveD1S[0][1].name}: +${(fiveD1S[0][1].value*100).toFixed(3)}% Champion Odds</td>`
        row2D=`<td>${fiveD1S.at(-1)[1].name}: ${(fiveD1S.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>`
        row3D=`<td>${fiveDAllS[0][1].name}: +${fiveDAllS[0][1].value.toFixed(3)} Expected Positions</td>`
        row4D=`<td>${fiveDAllS.at(-1)[1].name}: ${fiveDAllS.at(-1)[1].value.toFixed(3)} Expected Positions</td>`
    } else {
        fiveD1 = normalizeWCC(predictionData.wdc_data[firstDRace]);

        fiveDAllS = createSorted(currentWDC,fiveD1,"exp");
        fiveD1S = createSorted(currentWDC,fiveD1,"winProb");

        cateD=`<th>WDC</th>`
        row1D=`<td>${fiveD1S[0][1].name}: +${(fiveD1S[0][1].value*100).toFixed(3)}% Champion Odds</td>`
        row2D=`<td>${fiveD1S.at(-1)[1].name}: ${(fiveD1S.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>`
        row3D=`<td>${fiveDAllS[0][1].name}: +${fiveDAllS[0][1].value.toFixed(3)} Expected Positions</td>`
        row4D=`<td>${fiveDAllS.at(-1)[1].name}: ${fiveDAllS.at(-1)[1].value.toFixed(3)} Expected Positions</td>`
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
                
                <td>${sortedWDC1[0][1].name}: +${(sortedWDC1[0][1].value*100).toFixed(3)}% Champion Odds</td>
                <td>${sortedWCC1[0][1].name}: +${(sortedWCC1[0][1].value*100).toFixed(3)}% Champion Odds</td>
            </tr>
            <tr class="lower">
                <td>Biggest World Champion Loser</td>
                <td>${sortedWDC1.at(-1)[1].name}: ${(sortedWDC1.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>
                <td>${sortedWCC1.at(-1)[1].name}: ${(sortedWCC1.at(-1)[1].value*100).toFixed(3)}% Champion Odds</td>
            </tr>
            <tr class="higher">
                <td>Biggest Overall Gain</td>
                <td>${sortedWDCAll[0][1].name}: +${sortedWDCAll[0][1].value.toFixed(3)} Expected Positions</td>
                <td>${sortedWCCAll[0][1].name}: +${sortedWCCAll[0][1].value.toFixed(3)} Expected Positions</td>
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                <td>${sortedWDCAll.at(-1)[1].name}: ${sortedWDCAll.at(-1)[1].value.toFixed(3)} Expected Positions</td>
                <td>${sortedWCCAll.at(-1)[1].name}: ${sortedWCCAll.at(-1)[1].value.toFixed(3)} Expected Positions</td>
            </tr>

        </table>

        <br>
        <br>
        <br>

        <div>
            <h3 style="text-align: center;">Biggest Movements Past 5 Races World Championship</h3>
        </div>
        <table class="update-table">

            <tr>
                <th>Category</th>
                ${cateD}
                ${cateC}
            </tr>

            <tr class="higher">
                <td>Biggest World Champion Gain</td>
                
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
                ${row3D}
                ${row3C}
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                ${row4D}
                ${row4C}
            </tr>

        </table>

        <br>

        <div>
            <h3 style="text-align: center;">Biggest Race to Race Standings Movements</h3>
        </div>
        <table class="update-table">

            <tr>
                <th>Category</th>
                <th>WDC</th>
                <th>WCC</th>
            </tr>

            <tr class="higher">
                <td>Biggest World Champion Gain</td>
                
                <td>Pre-${seasonWDC1big[0]} ${seasonWDC1big[1]}: +${(seasonWDC1big[2]*100).toFixed(3)}% Champion Odds</td>
                <td>Pre-${seasonWCC1big[0]} ${seasonWCC1big[1]}: +${(seasonWCC1big[2]*100).toFixed(3)}% Champion Odds</td>
            </tr>
            <tr class="lower">
                <td>Biggest World Champion Loser</td>
                <td>Pre-${seasonWDC1small[0]} ${seasonWDC1small[1]}: ${(seasonWDC1small[2]*100).toFixed(3)}% Champion Odds</td>
                <td>Pre-${seasonWCC1small[0]} ${seasonWCC1small[1]}: ${(seasonWCC1small[2]*100).toFixed(3)}% Champion Odds</td>
            </tr>
            <tr class="higher">
                <td>Biggest Overall Gain</td>
                <td>Pre-${seasonWDCAllbig[0]} ${seasonWDCAllbig[1]}: +${seasonWDCAllbig[2].toFixed(3)} Expected Positions</td>
                <td>Pre-${seasonWCCAllbig[0]} ${seasonWCCAllbig[1]}: +${seasonWCCAllbig[2].toFixed(3)} Expected Positions</td>
            </tr>
            <tr class="lower">
                <td>Biggest Overall Loser</td>
                <td>Pre-${seasonWDCAllsmall[0]} ${seasonWDCAllsmall[1]}: ${seasonWDCAllsmall[2].toFixed(3)} Expected Positions</td>
                <td>Pre-${seasonWCCAllsmall[0]} ${seasonWCCAllsmall[1]}: ${seasonWCCAllsmall[2].toFixed(3)} Expected Positions</td>
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